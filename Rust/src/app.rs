use std::path::PathBuf;

// 3rd-party crate imports
use anyhow::Result;
use std::env;
use structopt::StructOpt;
use crate::image_compare::compare_image;

#[allow(unused_imports)] // TEMPLATE:REMOVE
use log::{debug, error, info, trace, warn};

// Local Imports
use crate::helpers::{BoilerplateOpts, HELP_TEMPLATE};

/// The verbosity level when no `-q` or `-v` arguments are given, with `0` being `-q`
pub const DEFAULT_VERBOSITY: u64 = 1;

#[derive(StructOpt, Debug)]
#[structopt(template = HELP_TEMPLATE,
            about = "TODO: Replace me with the description text for the command",
            global_setting = structopt::clap::AppSettings::ColoredHelp)]
pub struct CliOpts {
    #[allow(clippy::missing_docs_in_private_items)] // StructOpt compile-time errors if we doc this
    #[structopt(flatten)]
    pub boilerplate: BoilerplateOpts,

    /// File(s) to use as input
    ///
    /// **TODO:** Figure out if there's a way to only enforce constraints on this when not asking
    ///           to dump completions.
    inpath: Vec<PathBuf>,
}

/// The actual `main()`
pub fn main(opts: CliOpts) -> Result<()> {
    #[allow(unused_variables, clippy::unimplemented)] // TEMPLATE:REMOVE
    for inpath in opts.inpath {
        // Application logics
    }

    // Collect image path from the cli
    let args: Vec<String> = env::args().collect();
    if args.len() == 1 {
        panic!("Please provide a valid path");
    }
    // Get first argument from cli input
    let picture_1_path = args.get(1).unwrap();
    let path_1_ref: &str = &picture_1_path;

    // Get second argument from cli input
    let picture_2_path = args.get(2).unwrap();
    let path_2_ref: &str = &picture_2_path;

    let result: bool = compare_image(path_1_ref, path_2_ref);
    match result {
        true => println!("Pictures are the same"),
        false => println!("Pictures are the different"),
    }
    Ok(())
}

