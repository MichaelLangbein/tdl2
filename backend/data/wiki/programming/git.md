# Git

## Lingo

- `origin`: default name for your remote repository
    
- `head`: *your* last *commit* on the current branch. Does not yet include non-committed changes. 
    - When you switch branches with `git checkout`, the HEAD revision changes to point to the tip of the new branch.
    - When you do a `git pull`, your working directory may contain new stuff, which your head is lagging behind. To see the difference between the working dir and your last commit, do `git diff HEAD`
- `index`: The index is a single, large, binary file in baseOfRepo/.git/index, which lists all files in the current branch, their sha1 checksums, time stamps and the file name


<img src="../assets/programming/git_workflow.jpg" />

**Merging remote changes on master into local master** It can happen that somebody else has been messing with the master before you had a chance to commit your own changes. You will notice this by seeing your `git push} fail. In that case, try to first merge the remote changes into your local copy before pushing again. 
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



## Changing origin
```
git remote -v
git remote set-url origin https://github.com/USERNAME/REPOSITORY.git
```


## Merge vs. rebase

<img src="../assets/programmin/../programming/merge_vs_rebase.png" />


**Reverting and resetting** is best explained in this post: `https://stackoverflow.com/questions/4114095/how-to-revert-git-repository-to-a-previous-commit}. Basically, we have these options: 
    -`git revert <lastGoodCommitHash>..HEAD` will execute the inverse of all the operations and commit them as a new commit. This way, the old history stays intact.
    -`git reset <lastGoodCommitHash>` will un-stage all the commits from `<firstBadCommitHash>..HEAD`. This way, you're rewriting history, which is really only good if you're working alone on a repo.



## Moving through history quickly
```
# checkout prev (older) revision
git_prev() {
    git checkout HEAD~


# checkout next (newer) commit
git_next() {
    BRANCH=`git show-ref | grep $(git show-ref -s -- HEAD) | sed 's|.*/\(.*\)|\1|' | grep -v HEAD | sort | uniq`
    HASH=`git rev-parse $BRANCH`
    PREV=`git rev-list --topo-order HEAD..$HASH | tail -1`
    git checkout $PREV

```

## Undoing commits
- **undo last commit while keeping those changes in stage**: `git reset --soft HEAD~`
- **undo last commit while discarding those changes**:
- **create new commit that does the inverse of a given commit**: 

## Creating your own repository
Basically, any git folder can be used as a repository. But you still need to do some work to expose that folder over the web. The easiest way to work is certainly over gitlab. For alternative means if you don't have a hoster, this site lists a few of the possibilities: `http://www.jedi.be/blog/2009/05/06/8-ways-to-share-your-git-repository/}.
