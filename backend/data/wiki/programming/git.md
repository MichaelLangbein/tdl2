# Lingo

- `origin`: default name for your remote repository

- `index`: The index is a single, large, binary file in baseOfRepo/.git/index, which lists all files in the current branch, their sha1 checksums, time stamps and the file name

- `pointers`:
    - `tag`: a label pointing to a certain commit
    - `branch`: a label pointing to a certain commit *x* - moves along with every commit appended to *x$
    - `HEAD`: a label pointing to your currently selected branch (or to a commit directly) 
        - `detached HEAD`: when your *HEAD* doesn't point to a *branch* label, but to a commit directly.

- `commit`:
    - ```
        commit = makeCommit()
        commit.previous = HEAD       # commit on top op current state
        HEAD = commit.sha            # move HEAD forward
        if pointsToBranchLbl(HEAD):  # if on branch-tip, ...
            BRANCH = commit.sha      # ... move branch forward
        else:
            print("Created commit which does not belong to a branch. Make this a branch with 'git branch <branchname>' and 'git checkout <branchname>' ")
    ```
    - if the HEAD doesn't point to a branch-label, but to a commit, then you're in detached head state.

- `branch <branchname>`:
    - creates a new branch-lbl
    - points it to current commit

- `checkout <lbl>`
    - if *lbl* is the name of a branch, 
        - make workdir == branch
        - move HEAD to branch
    - if *lbl* is the name of a commit, 
        - make workdir == commit
        - move HEAD to commit
    - if *lbl* is a file name,
        - undo changes in file and reset it to state in HEAD.

- `merge`:
    - splices in commits by time of commit
    - after a merge, you get one merge-commit with two parents
    - after a merge, after deleting the merged in branch, you can no longer tell if a commit came from the source- or target-branch.

- `rebase`:
    - removes branch from where it had branched off
    - places it at end of target-branch
    - after a rebase you can no longer tell if a commit came from the source- or target-branch.

- `remote`:
    - `fetch && merge` == `pull`
    - `push`

- `--`
    - A unix-convention: `--` means: treat every argument after this point as a file name, no matter what it looks like.
    - Also means: treat what comes before as *not* a filename.
    - `git checkout <something> --`: check out a branch or commit named `something`
    - `git checkout -- <something>`: check out a file named `something`


<img width="35%" src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/git_workflow.jpg" />



# Merge vs. rebase

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/merge_vs_rebase.png" />



# Relative commit-naming scheme:
- `<commit>~2`: grand-parent of commit. Usually the commit you'll work with will be `HEAD`.
    - `<commit>~` is synonymous to `<commit>~1` which means: parent of commit
- `<commit>^2`: 
    - For a commit with only one parent, `~` and `^` mean the same thing. 
    - For a merge-commit, `<commit>^1` means the first parent of commit, `<commit>^2` means the second parent of commit.
        - In `commit = merge main into feature`, we'll have `main = commit^2` and `feature = commit^1` (I think)
    - `<commit>^ === <commit>^1`
    - `<commit>^0 === commit`
- You can chain those operators:
    - `<commit>~2^1~2` means: go to comit's grand-parent. That grand-parent was a merge - at that merge, go to the first of the merged branches. Within that first branch, go another two generations directly up.


# Undoing commits
Reverting and resetting is best explained [in this post](https://stackoverflow.com/questions/4114095/how-to-revert-git-repository-to-a-previous-commit). Basically, we have these options: 

- `git revert <lastGoodCommitHash>..HEAD` will execute the inverse of all the operations and commit them as a new commit. This way, the old history stays intact.
    - `--soft` will keep changes in staging

- `git reset <lastGoodCommitHash>` will un-stage all the commits from `<firstBadCommitHash>..HEAD`. 
    - This way, you're rewriting history, which is really only good if you're working alone on a repo, or if you haven't pushed that commit to remote yet.
    - after a revert of a commit that was already pushed, a push to remote only works with the force `-f` flag.
    - `--soft` will keep changes in staging





# Merging remote changes on master into local master
It can happen that somebody else has been messing with the master before you had a chance to commit your own changes. You will notice this by seeing your `git push` fail. In that case, try to first merge the remote changes into your local copy before pushing again. 
```
git commit // first saving our latest changes
git fetch  // getting remote stuff in remote-tracking-branches. Doesn't change our files yet
git diff master origin/master // compares what you have in master vs. what happened to master remotely
git merge remotes/origin/master
```

This will try to merge the upstream changes into yours. If it fails, the conflicting file will contain annotations like these: 

```
<<<<<<< HEAD
print("159 just edited this file")
=======
print("133 just edited this file")
>>>>>>> master
```

As you can guess, `<<<<<HEAD` is your code, `===` is a separator, and `>>>> master` is the end of the other guys code. 
Use a text-editor to resolve all conflicts. Eclipse actually has a graphical interpreter for the conflict-tags. Once the resolving is completed, a `git push` and `git commit` will complete the merge.

```
git status // shows that there is still a conflict
git add .
git status // shows that conflict is resolved, but merging still in progress
git commit -m "phew! managed to resolve the conflict!"
git push origin master
```



# Changing origin
```
git remote -v
git remote set-url origin https://github.com/USERNAME/REPOSITORY.git
```


# Moving through history quickly
```
# checkout prev (older) revision
git_prev() {
    git checkout HEAD~
}

# checkout next (newer) commit
git_next() {
    BRANCH=`git show-ref | grep $(git show-ref -s -- HEAD) | sed 's|.*/\(.*\)|\1|' | grep -v HEAD | sort | uniq`
    HASH=`git rev-parse $BRANCH`
    PREV=`git rev-list --topo-order HEAD..$HASH | tail -1`
    git checkout $PREV
}
```

# Creating your own repository
Basically, any git folder can be used as a repository. But you still need to do some work to expose that folder over the web. The easiest way to work is certainly over gitlab. For alternative means if you don't have a hoster, this site lists a few of the possibilities: `http://www.jedi.be/blog/2009/05/06/8-ways-to-share-your-git-repository/`.

I love this way:
```bash
# First we navigate to the repository place and will create a new project-X dir
$ cd /share/git
$ mkdir project-X	
$ cd project-X
# now we initialize this directory
# but instead of using git init, we use  git --bare init
# "A short aside about what git means by bare: A default git repository assumes that you will be using it as your working directory, 
# so git stores the actual bare repository files in a .git directory alongside all the project files. Remote repositories don't need 
# copies of the files on the filesystem unlike working copies, all they need are the deltas and binary what-nots of the repository itself. This is what "bare" means to git. Just the repository itself."
$ git --bare init


# First go to your local repository
$ cd $HOME/project-X
# Then make the link to the shared repository
$ git remote add origin file:///share/git/project-X
# We push to the remote repository
$ git push origin main
```
