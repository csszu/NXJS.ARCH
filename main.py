import os
import random
import string
import time
from github import Github
from github import GithubException

class GitHubPRMergeAutomator:
    def __init__(self, token, repo_name, username):
        self.g = Github(token, per_page=100)
        self.repo = self.g.get_repo(repo_name)
        self.username = username
        self.file_path = "status.md"
        self.rate_limit_sleep = 3
        self.error_sleep = 15
        
    def get_current_count(self):
        try:
            content = self.repo.get_contents(self.file_path)
            text = content.decoded_content.decode('utf-8').split('\n')[0]
            return int(text.split()[0])
        except:
            return 0
    
    def update_status_file(self, num):
        badges = [
            (16, "default"),
            (128, "bronze"),
            (1024, "silver"),
            (float('inf'), "gold")
        ]
        
        badge = next((b[1] for b in badges if num < b[0]), "default")
        img = f"![pull-shark](images/pull-shark-{badge}.png)"
        
        content = f"{num} pull requests merged<br>Currently:<br>{img}"
        
        try:
            current = self.repo.get_contents(self.file_path)
            self.repo.update_file(self.file_path, f"Update #{num}", content, current.sha)
        except Exception as e:
            print(f"Error updating status: {e}")
            raise

    def create_branch_with_change(self, num):
        branch_name = f"auto-pr-{num}-{random.randint(1000,9999)}"
        main_sha = self.repo.get_branch("main").commit.sha
        
        self.repo.create_git_ref(f"refs/heads/{branch_name}", main_sha)
        
        content = self.repo.get_contents(self.file_path)
        current = content.decoded_content.decode('utf-8')
        new_content = current + f"\n<!-- Change {num} -->"
        
        self.repo.update_file(
            path=self.file_path,
            message=f"Auto change #{num}",
            content=new_content,
            sha=content.sha,
            branch=branch_name
        )
        
        return branch_name

    def process_single_pr(self, num):
        try:
            branch = self.create_branch_with_change(num)
            
            pr = self.repo.create_pull(
                title=f"Auto PR #{num}",
                body="Automated pull request",
                head=branch,
                base="main"
            )
            
            pr.merge(merge_method="merge")
            
            self.update_status_file(num)
            
            try:
                self.repo.get_git_ref(f"heads/{branch}").delete()
            except:
                pass
                
            return True
            
        except GithubException as e:
            print(f"GitHub error: {e.data.get('message', str(e))}")
            return False
        except Exception as e:
            print(f"Error: {e}")
            return False

    def run(self, target_count):
        current = self.get_current_count()
        print(f"Starting from {current}, target {target_count}")
        
        while current < target_count:
            start_time = time.time()
            success = self.process_single_pr(current + 1)
            
            if success:
                current += 1
                elapsed = time.time() - start_time
                print(f"Pull Request #{current} merged in {elapsed:.1f}s")
                
                remaining = max(0, self.rate_limit_sleep - elapsed)
                time.sleep(remaining)
            else:
                print(f"Retrying in {self.error_sleep}s...")
                time.sleep(self.error_sleep)

if __name__ == "__main__":
    try:
        print("GitHub PR Automator (Fast Version)")
        token = os.getenv('GITHUB_TOKEN') or input("GitHub Token: ").strip()
        repo = os.getenv('GITHUB_REPO') or input("Repo (user/repo): ").strip()
        user = os.getenv('GITHUB_USER') or input("GitHub User: ").strip()
        target = int(os.getenv('TARGET_PR') or input("Target PRs: ").strip())
        
        automator = GitHubPRMergeAutomator(token, repo, user)
        automator.run(target)
        
    except KeyboardInterrupt:
        print("\nStopped by user")
    except Exception as e:
        print(f"Fatal error: {e}")
