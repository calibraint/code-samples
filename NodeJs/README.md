# Rust CLI Project

## Features

- Uses [raster](https://kosinix.github.io/raster/docs/raster/) for image comparision.
- Uses [raster:compare] compares the each pixels between images (jpg | png ) and checks for Variation in lumosity, colour, etc.



## Usage

1. Clone a copy of this repository (`.git` must exist, so no archive downloads)
2. Run `cargo build` to initalize required dependencies
3. Edit `src/app.rs` to implement your application logic
4. From src/ run following command `cargo run <path to picture 1> <path to picture 2>`
5. From the same directory run `cargo test` to run the unit test case.

### Tips

- Edit the `DEFAULT` command. That's what it's there for.
- You can use `just` from any subdirectory in your project. It's like `git` that
  way.
- `just path/to/project/` (note the trailing slash) is equivalent to
  `(cd path/to/project; just)`
- `just path/to/project/command` is equivalent to
  `(cd path/to/project; just command)`

- The simplest way to activate the bash completion installed by `just install`
  is to add this to your `.bashrc`:

  ```sh
  for script in ~/.bash_completion.d/*; do
    if [ -e "$script" ]; then
      . "$script"
    fi
  done
  ```

      foo

- The simplest way to activate the zsh completion installed by `just install` is
  to add this to your `.zshrc`:

  ```zsh
  fpath=(~/.zsh/functions(:A) $fpath)
  ```

- When using clap/StructOpt validators for inputs such as filesystem paths, only
  use them to bail out early on bad input, not as your only check. They're
  conceptually similar to raw pointers and can be invalidated between when you
  check them and when you try to use them because Rust can't control what the OS
  and other programs do in the interim. See
  [this blog post](http://blog.ssokolow.com/archives/2016/10/17/a-more-formal-way-to-think-about-validity-of-input-data/)
  for more on this idea of references versus values in command-line arguments.

## Build Behaviour

In order to be as suitable as possible for building compact, easy-to-distribute,
high-reliability replacements for shell scripts, the following build options are
defined:

### If built via `cargo build --release`:

1. Full LTO (Link-Time Optimization) will be enabled. (`lto = true`)
2. The binary will be built with `opt-level = "z"` to further reduce file size.
3. If `panic="abort"` is uncommented in `Cargo.toml`, LTO will prune away the
   unwinding machinery to save even more space, but panics will not cause `Drop`
   implementations to be run and will be uncatchable.

1. Unless otherwise noted, all optimizations listed above.
   [[1]](https://lifthrasiir.github.io/rustlog/why-is-a-rust-executable-large.html)
2. The binary will be stripped with
   [`--strip-unneeded`](https://www.technovelty.org/linux/stripping-shared-libraries.html)
   and then with
   [`sstrip`](http://www.muppetlabs.com/~breadbox/software/elfkickers.html) (a
   [more aggressive](https://github.com/BR903/ELFkickers/tree/master/sstrip)
   companion used in embedded development) to produce the smallest possible
   pre-compression size.
3. The binary will be compressed via
   [`upx --ultra-brute`](https://upx.github.io/). In my experience, this makes a
   file about 1/3rd the size of the input.
