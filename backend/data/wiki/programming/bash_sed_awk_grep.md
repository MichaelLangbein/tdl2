# Bash

Lot's of useful tips [here](https://bertvv.github.io/cheat-sheets/Bash.html)

```bash
set -x           # for debugging only: print out current line before executing it
set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes



# In general, always leave spaces between operators. Otherwise they might get interpreted as one single command. Example: [[-f $f]] <-- Syntax error
# 

# Variable assignment must not have spaces around =
myFiles=$(ls *.mp3)
# Refering to variables as $myVar can be dangerous
# because they may contain a whitespace, in which case they
# will be interpreted as *two commands*.
# Safer: referring to variables as "${myVar}"


capitalize () {
    # Like in perl, functions don't state their arguments
    # They can access them through $1, $2, ... $@
    # $0 is the function's name.
    upperCased=$(echo $1 | awk '{ print toupper($0) }')

    # Functions are not made to actually return anything. 
    # If we want to return something, we need to echo it out, 
    # and then catch the output like so:
    # result=$(capitalize "myname")
    echo "$upperCased"
}


# Here we *deliberately abstain* from quoting $myFiles, because we *want* the variable to expand to multiple values `file1 file2 file3 ...`
for file in $myFiles; do 

    # Use [[ always. 
    #   - Single [ require you to quote all variables (example: [ -f "$f" ])
    #   - [[ allows &&, || and <, > for boolean testing (would be interpreted as pipes in [])
    # List of allowed comparison operators: https://tldp.org/LDP/abs/html/comparison-ops.html
    if [[ -f $file ]]; then 
        result=$( capitalize $file )
        echo $result
    fi
done

```

# Awk
For managing tabular data.

Take care to use single quotes, not double quotes. Otherwise bash will try to resolve a variable named `$2`.
```bash
docker volume ls | awk '{print $2}'
```

# Sed
For editing unstructured text.

# Grep
