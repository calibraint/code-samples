# Rust CLI Project
[Boilerplate](https://github.com/ssokolow/rust-cli-boilerplate) reference https://github.com/ssokolow/rust-cli-boilerplate

## Features

- Uses [Image](https://crates.io/crates/image) for image comparision.
- Compares the each pixels between images (jpg | png ) and checks for Variation in lumosity, colour, etc.



## Usage

1. Clone a copy of this repository (`.git` must exist, so no archive downloads)
2. Run `cargo build` to initalize required dependencies
3. Edit `src/app.rs` to implement your application logic
4. From `project root dir` run following command `cargo run <path to picture 1> <path to picture 2>`
5. From the same directory run `cargo test` to run the unit test case.

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
