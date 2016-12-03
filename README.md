# byebug-debugger

An [Atom](https://atom.io/) package for integrating with Ruby's
[byebug](https://github.com/deivid-rodriguez/byebug) debugger.

This is a work in progress and though it is usable it is far from implementing all features of a
standard debugger as a GUI. Nevertheless, it is possible to send commands to byebug and see their
responses as if they were used from the command line.

## How to use

Until the configuration dialog is implemented, you need to create the configuration files by hand following these steps:

1. Create a directory named `.byebug-debugger` in your project's root folder.
2. Create a `config.json` file inside that directory and add two entries named `executable` and `arguments` to specify the script to run and the arguments to pass.

For example:

```
{
    "executable": "./sample-ruby-program",
    "arguments": []
}
```

That's it. Keep in mind that the script you run must start byebug debugger in remote mode. For more details about that see [byebug's documentation](https://github.com/deivid-rodriguez/byebug/blob/master/GUIDE.md), but usually placing the following code at the very beginning of your Ruby program is enough:

```
require 'byebug'
require 'byebug/core'
Byebug.wait_connection = true
Byebug.start_server('localhost')
```

## How to launch Rails in debug mode

To launch a Rails application within byebug debugger, you can create a launch script in your `.byebug-debugger`, configure it as `executable` in `config.json` and set its content to:

```
#!/usr/bin/env ruby
APP_PATH = File.expand_path('../../config/application', __FILE__)

require 'byebug'
require 'byebug/core'

Byebug.wait_connection = true
Byebug.start_server('localhost')

require_relative '../config/boot'
require 'rails/commands'
```

Make it executable if you are not using Windows and have fun.

## How to contribute

* First of all have a look at the [issues](https://github.com/izaera/atom-byebug/issues) and see if you can think of more features or things to fix. In case you find any, please report it.
* If you want to code or test the package do the following:
  1. Clone the [repository](https://github.com/izaera/atom-byebug)
  2. Register the Atom package for development into your Atom installation (add a symbolic link to your cloned repository in your `$HOME/atom/packages` folder.
  3. Start Atom and look for `Byebug Debugger` in the Packages menu.
  4. Find the sample configuration file `config.json` for the package in the `.byebug-debugger` folder of the package's project. That file specifies the Ruby program to run and the arguments to pass. In the future, a dialog will be available to edit this file.
  5. Find the sample Ruby program `sample-ruby-program` in the same folder. This program is executed when the debugger is launched.
* To develop: choose an issue to develop or create a new one for your feature so that the community doesn't duplicate the work. Hack it, and send a pull request.
* To test: use and test the package and report any issue you may find.

Thanks :-)
