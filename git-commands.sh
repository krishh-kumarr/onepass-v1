# Navigate to your project directory
cd d:\coding\onepass-v1

# Initialize a Git repository if not already done
git init

# Add all files to staging
git add .

# Commit the changes
git commit -m "Update admin services with academic record management"

# Add your remote repository (replace the URL with your actual repository URL)
# If you've already set up the remote, you can skip this step
git remote add origin https://github.com/yourusername/onepass-v1.git

# Push to the repository
git push -u origin main  # or 'master' depending on your default branch name
