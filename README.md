# byebug-debugger

An [Atom](https://atom.io/) package for integrating with Ruby's [byebug](https://github.com/deivid-rodriguez/byebug) debugger.

See [below](#how-to-contribute) if you are willing to help to get to the first beta version (v0.1)

## WARNING: not everything is implemented (work in progress)

![Not everything is implemented: work in progress](https://upload.wikimedia.org/wikipedia/commons/2/28/Fresque-251-rue-jean-jaures3.jpg)
[Image credits: [Ph. Saget](https://commons.wikimedia.org/wiki/File%3AFresque-251-rue-jean-jaures3.jpg)]


## How to contribute

* First of all have a look at the [issues](https://github.com/izaera/atom-byebug/issues) and see if you can think of more features or things to fix. In case you find any, please report it.
* If you want to code or test the package do the following:
  1. Clone this repository
  2. Register the atom package for development into your Atom installation (add a symbolic link to your cloned repository in your $HOME/atom/packages folder.
  3. Start Atom and look for Byebug Debugger in the Packages menu.
  4. Find the sample configuration file (config.json) for the package in the .byebug-debugger folder of the package's project. That file specifies the ruby program to run and the arguments to pass. In the future, a dialog will be available to edit this file.
  5. Find the sample ruby program (sample-ruby-program) in the same folder. This program is executed when the debugger is launched.
* To develop: choose an issue to develop or create a new one for your feature so that the community doesn't duplicate the work. Hack it, and send a pull request.
* To test: use and test the package and report any issue you may find.

Thanks :-)
