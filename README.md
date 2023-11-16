Set up:

brew:

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
(echo; echo 'eval "$(/usr/local/bin/brew shellenv)"') >> /Users/robson/.zprofile
```

rbenv:

```shell
brew install rbenv ruby-build
```

jenv:

```shell
brew install jenv
```

nvm

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

```

After the above, make sure that `~/.zshrc` has the following:

```shell
# rbenv
eval "$(rbenv init - zsh)"

# jenv
export PATH="$HOME/.jenv/bin:$PATH"
eval "$(jenv init -)"

# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# android
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/emulator
```

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
