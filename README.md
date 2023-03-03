# What is this?
There's a think called [AHK](https://www.autohotkey.com/) which lets you remap any key press into whatever you'd like, often another key press. That's great and all, but what if you wanted to remap keys on a secondary keyboard, while leaving the first one unchanged, is that even possible? Yes! Through the magic of [AHI](https://github.com/evilC/AutoHotInterception).

Turns out, writing the script file for remapping keys is **very** boring. Even for something as small as a numpad. That's why I made this website. It allows you to type in a single key for each button on a numpad (except Num Lock and Fn for hardware reasons). Then you can export your selected configuration to a `.ahk` script which *should* be plug-and-play.

## Planned features
- Importing a script generated using this tool, to continue editing where you left off
- Saving state to local storage
