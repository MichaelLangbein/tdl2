# PHP

## Composer
`composer init`
`composer install`


Creates own autoloader.

````json
"autoload": {
  "psr4": {
    "Core\\": "Core/"  
  }
}
```
`composer dump-autoload`

## Namespaces
By default php uses a global namespace.


## Imports

Insert file:
`require_once "../Path/File.php";`

Import symbols:
````php
// Lib/Transaction.php
namespace Lib\Transaction;  // usually uses dir-structure
class Transaction {}

// main.php
require_once "./Lib/Transaction.php";
new Transaction(); // <-- ERROR: class not found
new Lib\Transaction\Transaction();  // works
use Lib\Transaction;
new Transaction(); // works

```

`use` is only required for classes outside the files own namespace.


