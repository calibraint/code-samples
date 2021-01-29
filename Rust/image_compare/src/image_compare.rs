use raster::compare;

// open_img can be accessed by compare_image wich will use raster::open to return raster::image
fn open_img(path: &str) -> raster::Image {
    raster::open(path).unwrap()
}

// compare_image exposed to all file to comapre two images
pub fn compare_image(path_1_ref: &str, path_2_ref: &str) -> bool {
    let image1: raster::Image = open_img(path_1_ref);
    let image2: raster::Image = open_img(path_2_ref);
    compare::equal(&image1, &image2).unwrap()
}
