#[tokio::main]
async fn main() {
    if let Err(error) = hellotime_axum::run().await {
        eprintln!("{error}");
        std::process::exit(1);
    }
}
