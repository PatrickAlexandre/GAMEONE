async function captureImage() {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const img = document.getElementById('replaceableImage');

    // Request access to the camera
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    // Play the video to trigger the camera
    video.play();

    // Wait for the video to be ready
    await new Promise(resolve => {
        video.onloadedmetadata = () => {
            resolve();
        };
    });

    // Draw the video frame to the canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the data URL of the image from the canvas
    const dataUrl = canvas.toDataURL('image/png');

    // Stop the video stream
    stream.getTracks().forEach(track => track.stop());

    // Replace the img src with the captured image
    img.src = dataUrl;

    // Hide the video element
    video.style.display = 'none';
}
