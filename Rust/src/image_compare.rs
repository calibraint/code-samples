use image;
use image::ImageBuffer;
use image::Rgb;
use std::vec::Vec;

fn open_img(path: &str) -> image::ImageBuffer<image::Rgb<u8>, std::vec::Vec<u8>> {
    let image = image::open(path).expect("Invalid path | File not found");
    image.to_rgb8()
}

pub fn compare(image_1: &ImageBuffer<Rgb<u8>, Vec<u8>>, image_2: &ImageBuffer<Rgb<u8>, Vec<u8>>) -> (i32, i32, i32) {
	let image_1_vec = image_1.as_flat_samples().samples;
    let image_2_vec = image_2.as_flat_samples().samples;

	image_1_vec
        .chunks_exact(3)
        .zip(image_2_vec.chunks_exact(3))
        .fold((0, 0, 0), |(red, green, blue), (pixel_image_1, pixel_image_2)| {
            (
                red + (pixel_image_1[0] as i32 - pixel_image_2[0] as i32).abs(),
                green + (pixel_image_1[1] as i32 - pixel_image_2[1] as i32).abs(),
                blue + (pixel_image_1[2] as i32 - pixel_image_2[2] as i32).abs(),
            )
        })
}

fn check_dimensions (dimension_1: (u32, u32), dimension_2: (u32, u32)) {
    if dimension_1 != dimension_2 {
        panic!("Pictures are different");
    }
}
    
// compare_image exposed to all file to comapre two images
pub fn compare_image(path_1_ref: &str, path_2_ref: &str) -> (i32, i32, i32) {
    let image_1 = open_img(path_1_ref);
    let image_2 = open_img(path_2_ref);
    // Check dimensions
    check_dimensions(image_1.dimensions(), image_2.dimensions());
    // check pixel by pixel
    compare(&image_1, &image_2)
}
