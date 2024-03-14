# PHP

## Minimum scaffold

```php
// index.php
<html>
<body>
<h2>Hello, php!</h2>


<form method="POST" action="processor.php">
  // note how html supports nested properties
  <input type="text" name="person[name]" required>
  <input type="number" name="person[age]" required>
  <button type="submit">OK</button>
</form>

</body>
</html>
```

```php
// process.php
<html>
<body>

<h2>Response</h2>

<div>
  <?php echo print_r($_POST); ?>
</div>

</body>
</html>
```

`php -S localhost:8000`

## Imports

Insert file:
`require_once "../Path/File.php";`

Import symbols:

```php
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

- `use` is only required for classes outside the files own namespace.
- `use` doesn't import anything! You still have to `require` a file.
  - except if you use an autoloader (like the one composer provides)
  - then you only have to `require` the autoloader, all other classes will be loaded by the autoloader
- you probably shouldn't use a namespace for your entry-file, because if you do use a namespace, you have to mark global objects explicitly as coming form outside of that namespace by prefixing them with a `\`.

## Composer

`composer init`
`composer install`

Creates own autoloader.

```json
"autoload": {
  "psr4": {
    "Core\\": "Core/"
  }
}
```

`composer dump-autoload -o`

```php
if (is_readable(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}
```

Composer's autoloader makes a few assumptions and only works if you adhere to them:

- only one class per file
- each file has a namespace identical to the folder structure
