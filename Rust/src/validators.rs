/*! Validator functions suitable for use with `Clap` and `StructOpt` */
// Copyright 2017-2020, Stephan Sokolow


/// Special filenames which cannot be used for real files under Win32
///
/// (Unless your app uses the `\\?\` path prefix to bypass legacy Win32 API compatibility
/// limitations)
///
/// **NOTE:** These are still reserved if you append an extension to them.
///
/// Sources:
/// * [Boost Path Name Portability Guide
/// ](https://www.boost.org/doc/libs/1_36_0/libs/filesystem/doc/portability_guide.htm)
/// * Wikipedia: [Filename: Comparison of filename limitations
/// ](https://en.wikipedia.org/wiki/Filename#Comparison_of_filename_limitations)
///
/// **TODO:** Decide what (if anything) to do about the NTFS "only in root directory" reservations.


#[allow(unused_imports)]
use crate::image_compare;

#[cfg(test)]
mod image_compare_test {
    use super::*;
    use std::path::PathBuf;

    fn join_path(path: &str) -> PathBuf {
        let srcdir = std::path::PathBuf::from("./src/assets");
        let result = std::fs::canonicalize(&srcdir).unwrap().join(path);
        result
    }

    // join path will return absolute path for the image
    // unit test case that will return true
    #[test]
    pub fn test_equal() {
        let path_1 = join_path("cat_edited.jpg");
        let path_2 = join_path("cat_edited.jpg");
        let result: (i32, i32, i32) = image_compare::compare_image(path_1.to_str().unwrap(), path_2.to_str().unwrap());
        assert_eq!(result, (0, 0, 0))
    }

    // unit test case that will return false
    #[test]
    pub fn test_different() {
        let path_1 = join_path("cat_edited.jpg");
        let path_2 = join_path("cat2.jpg");
        let result: (i32, i32, i32) = image_compare::compare_image(path_1.to_str().unwrap(), path_2.to_str().unwrap());
        assert_eq!(result, (26488566, 42838250, 63024127))
    }
}
