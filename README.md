# Camerapi

Camera PI is a module that allow to use the Raspberry PI camera from Node.JS

It wraps the native `raspistill` and `raspivid` commands found with your distro.

## To Install

```bash
npm install camerapi
```

## Usage

```javascript
var Camera = require('camerapi');
var cam = new Camera();
```

There are 2 ways to set the options for taking the photo/video. Option 1
is to chain the functions specifically which might make more sense to begin with:

```javascript
cam
    .timeout(150)
    .quality(85)
    .width(800)
    .height(600)
    .awb('sun')
    .hflip()
    .vflip()
    // And then take the Photo
    .takePhoto('/tmp/photo.jpg');
```

The other option is to set using a hash:

```javascript
cam
    .options({
        timeout: 150,
        width:   3280,
        height:  2050,
        quality: 85,
        hflip:   true,
        vflip:   true,
        awb:     'sun'
    })
    // And then take the Photo
    .takePhoto('/tmp/photo.jpg');
```

The function names and the option names are exactly the same. A full list of options
can be found further down this page.

## Output

You can specify a base folder for your files to be saved:

```javascript
cam.baseFolder('/tmp');
```

If you don't specify a filename in `takePhoto` or `recordVideo` then a file
will be generated with a time in the destination folder.

However if you do specify a filename, it can be absolute or relative (to the baseFolder):

```javascript
var cam = new Camera();
cam.baseFolder('/tmp');
cam.takePhoto('photos/photo1.jpg');
```

would save to `/tmp/photos/photo1.jpg`

You can avoid all this logic and use a absolute filename path for your photo/video:

```javascript
var cam = new Camera();
cam.takePhoto('/tmp/photo.jpg');
```

## Taking Photos

Here's a full example of code to take a photo:

```javascript
var filename = '/tmp/photo.jpg';
var cam = new Camera();
cam
    .options({
        timeout:    150,         // Time (in ms) before takes picture and shuts down (if not specified, set to 5s)
        quality:    85,          // Set jpeg quality <0 to 100>
        width:      3280,        // Set image width <pixels>
        height:     2050,        // Set image height <pixels>
        sharpness:  10,          // Set image sharpness (-100 to 100)
        contrast:   10,          // Set image contrast (-100 to 100)
        brightness: 50,          // Set image brightness (0 to 100)
        saturation: 10,          // Set image saturation (-100 to 100)
        iso:        200,         // Set capture ISO
        vstab:      true,        // Turn on video stabilisation
        ev:         1,           // Set EV compensation - steps of 1/6 stop
        exposure:   'backlight', // Set exposure mode
        awb:        'sun',       // Set AWB mode
        imxfx:      'solarise',  // Set image effect
        colfx:      '1:1',       // Set colour effect (U:V)
        metering:   'matrix',    // Set metering mode
        rotation:   90,          // Set image rotation (0-359)
        hflip:      true,        // Set horizontal flip
        vflip:      true,        // Set vertical flip
        roi:        '0.0-1.0',   // Set region of interest (x,y,w,d as normalised coordinates [0.0-1.0])
        shutter:    3,           // Set shutter speed in microseconds
        awbgains:   true,        // Set AWB gains - AWB mode must be off
        drc:        'med',       // Set DRC Level
        stats:      true,        // Force recomputation of statistics on stills capture pass
        annotate:   'value',     // Enable/Set annotate flags or text
        stereo:     true,        // Select stereoscopic mode
        decimate:   true,        // Half width/height of stereo image
        stereoswap: true,        // Swap camera order for stereoscopic
        annotateex: 'value'      // Set extra annotation parameters (text size, text colour(hex YUV), bg colour(hex YUV))
    })
    .takePhoto(filename, function (file, err) {
        // This is an optional callback
        if (err) {
            console.error(err);
        } else {
            console.log('Took Photo: ' + filename);
        }
    });
```

## Recording Videos

Here's a full example of code to record a video:

TODO


	cam.timeout(5000)
	.bitrate(3500000)
	.framerate(5)
	.streamVideo("foo.h264")
	.fullscreen()
	.recordVideo();

Or

	cam.timeout(5000)
	.bitrate(3500000)
	.framerate(5)
	.fullscreen()
	.recordVideo("myvideo.h264");

Or

	cam.timeout(5000)
	.bitrate(3500000)
	.framerate(5)
	.fullscreen()
	.recordVideo("myvideo.h264",callback);

	function callback(file,error){

		//do some fun stuff

	}

## Re-using

If you want to use your `cam` variable more than once and with different options, you can reset
reset the var:

```javascript
cam.reset();
```

## More information

For more information about the raspberry pi camera module, see the [official documentation](http://www.raspberrypi.org/documentation/raspbian/applications/camera.md)



## License

(The MIT License)

Copyright (c) 2014 Leandro Salas

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
