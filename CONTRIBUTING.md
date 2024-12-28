# Contributing

This guide provides instructions for contributing to this Capacitor plugin.

## Developing

### Requirements

#### Android studio

Download and install [Android studio](https://developer.android.com/studio). The code has been developed using `Android Studio Hedgehog | 2023.1.1 Patch 1`

#### Xcode

Download and install Xcode from the App Store. The code has been developed using `Xcode version 15.0.1 (15A507)``

### Recommend set up:

It is recommended to use `brew`, `rbenv`, `jenv` and `nvm` for the set up. The used versions for ruby, java and node can be found below.

#### brew:

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
(echo; echo 'eval "$(/usr/local/bin/brew shellenv)"') >> /Users/robson/.zprofile
```

#### rbenv:

```shell
brew install rbenv ruby-build
```

#### jenv:

```shell
brew install jenv
```

#### nvm

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

```

#### Local setup

Your `~/.zshrc` should look more or less like the following:

```shell
# rbenv
eval "$(rbenv init - zsh)"

# jenv
export PATH="$HOME/.jenv/bin:$PATH"
eval "$(jenv init -)"

# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# nvm autoload .nvmrc
autoload -U add-zsh-hook
load-nvmrc() {
  local nvmrc_path
  nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version
    nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$(nvm version)" ]; then
      nvm use
    fi
  elif [ -n "$(PWD=$OLDPWD nvm_find_nvmrc)" ] && [ "$(nvm version)" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}

# android
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/emulator
```

You will also need a `~/.huskyrc` like this the following for [husky](https://typicode.github.io/husky/):

```shell
# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

if [ -f ".nvmrc" ]; then
  nvm use --silent
fi

```

#### Dependency version

ruby:

```shell
rbenv install 2.7.8
```

java:

```shell
brew install openjdk@17
jenv add /usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home # path to java installation from the above

```

node:

```shell
nvm install 18
```

node global packages:

```
npm i -g add @ionic/cli @angular/cli
```

### Installation

- Fork and clone the repo
- Install the dependencies: `npm i`

## Scripts

#### `npm run build`

Build the plugin web assets and generate plugin API documentation using [`@capacitor/docgen`](https://github.com/ionic-team/capacitor-docgen).

It will compile the TypeScript code from `src/` into ESM JavaScript in `dist/esm/`. These files are used in apps with bundlers when your plugin is imported.

Then, Rollup will bundle the code into a single file at `dist/plugin.js`. This file is used in apps without bundlers by including it as a script in `index.html`.

#### `npm run verify`

Build and validate the android native project.

This is useful to run in CI to verify that the plugin builds for Android platform.

#### `npm run lint` / `npm run fmt`

Check formatting and code quality, autoformat/autofix if possible.

This template is integrated with ESLint, Prettier. Using these tool is completely optional, but the [Capacitor Community](https://github.com/capacitor-community/) strives to have consistent code style and structure for easier cooperation.
