var util = require('util');
var _    = require('lodash');

module.exports = function Camera () {

    'use strict';

    this.filename   = null;
    this.folder     = null;
    this.command    = '';
    this.parameters = {};

    /**
     * Take a Photo
     *
     * @param {string|function}  file
     * @param {function}         callback
     */
    this.takePicture = function takePicture (file, callback) {
        // Support for takePicture(cb) instead of providing file
        if (typeof file === 'function') {
            callback = file;
            file     = null;
        }

        // Use a default base folder if not specifically set
        if (!this.folder) {
            this.folder = util.format("%s/pictures", __dirname);
        }

        if (file) {
            // If the file is absolute, use it alone instead of prepending the folder
            if (file.substr(0, 1) === '/') {
                this.filename = file;
            } else {
                this.filename = util.format('%s/%s', this.folder, file);
            }
        } else {
            this.filename = util.format('%s/%s.jpg', this.folder, new Date().toJSON());
        }

        this.output(this.filename);

        this.command = 'raspistill';
        var self = this;

        for (var key in this.parameters) {
            if (this.parameters[key] === true) {
                // This is a switch, only needs the parameter not the value
                this.command += ' ' + key;
            } else {
                this.command += util.format(' %s "%s"', key, this.parameters[key]);
            }
        }

        var exec = require('child_process').exec;
        exec(this.command, function (error, stdout, stderr) {
            if (typeof callback === 'function') {
                callback(self.filename, stderr);
            }
        });
    };

    /**
     * Record a Photo
     *
     * @param {string|function}  file
     * @param {function}         callback
     */
    this.recordVideo = function (file, callback) {
        // Support for recordVideo(cb) instead of providing file
        if (typeof file === 'function') {
            callback = file;
            file     = null;
        }

        // Use a default base folder if not specifically set
        if (!this.folder) {
            this.folder = util.format("%s/videos", __dirname);
        }

        if (file) {
            // If the file is absolute, use it alone instead of prepending the folder
            if (file.substr(0, 1) === '/') {
                this.filename = file;
            } else {
                this.filename = util.format('%s/%s', this.folder, file);
            }
        } else {
            this.filename = util.format('%s/%s.h264', this.folder, new Date().toJSON());
        }

        this.output(this.filename);

        this.command = 'raspivid';
        var self = this;

        // if we are streaming remove output command
        if (this.parameters['-o - >']) {
            delete this.parameters['-o'];
        }

        for (var key in this.parameters) {
            if (this.parameters[key] === true) {
                // This is a switch, only needs the parameter not the value
                this.command += ' ' + key;
            } else {
                this.command += util.format(' %s "%s"', key, this.parameters[key]);
            }
        }

        var exec = require('child_process').exec;
        exec(this.command, function (error, stdout, stderr) {
            if (typeof callback === 'function') {
                callback(self.filename, stderr);
            }
        });
    };

    /**
     * Parse options into internal functions
     *
     * @param {{}}  options
     */
    this.options = function (options) {
        var self = this;

        _.map(options, function (value, key) {
            if (typeof self[key] === 'function') {
                self[key](value);
            }
        });

        return this;
    };

    /**
     * JPG Quality
     *
     * @param {int}  value  Percentage 1 to 100
     */
    this.quality = function (value) {
        this.parameters['-q'] = parseInt(value, 10);
        return this;
    };

    /**
     * Width
     *
     * @param {int}  value  Pixels
     */
    this.width = function (value) {
        this.parameters['-w'] = parseInt(value, 10);
        return this;
    };

    /**
     * Height
     *
     * @param {int}  value  Pixels
     */
    this.height = function (value) {
        this.parameters['-h']= parseInt(value, 10);
        return this;
    };

    /**
     * Preview window settings
     *
     * @param {string}  value  'x,y,w,h'
     */
    this.preview = function (value) {
        this.parameters['-p'] = value;
        return this;
    };

    /**
     * Fullscreen preview mode
     */
    this.fullscreen = function () {
        this.parameters['-f'] = true;
        return this;
    };

    /**
     * Do not display a preview window
     */
    this.nopreview = function () {
        this.parameters['-n'] = true;
        return this;
    };

    /**
     * Preview window opacity
     *
     * @param {int}  value  0 to 255
     */
    this.opacity = function (value) {
        this.parameters['-op'] = parseInt(value, 10);
        return this;
    };

    /**
     * Set image sharpness
     *
     * @param {int}  value  -100 to 100
     */
    this.sharpness = function (value) {
        this.parameters['-sh'] = value;
        return this;
    };

    /**
     * Set image contrast
     *
     * @param {int}  value  -100 to 100
     */
    this.contrast = function (value) {
        this.parameters['-co'] = value;
        return this;
    };

    /**
     * Set image brightness
     *
     * @param {int}  value  0 to 100
     */
    this.brightness = function (value) {
        this.parameters['-br'] = parseInt(value, 10);
        return this;
    };

    /**
     * Set image saturation
     *
     * @param {int}  value  -100 to 100
     */
    this.saturation = function (value) {
        this.parameters['-sa'] = value;
        return this;
    };

    /**
     * Set capture ISO
     *
     * @param {int}  value
     */
    this.iso = function (value) {
        value = parseInt(value);
        if (value) {
            this.parameters['-ISO'] = value;
        }

        return this;
    };

    /**
     * Turn on video stabilisation
     */
    this.vstab = function () {
        this.parameters['-vs'] = true;
        return this;
    };

    /**
     * Set EV compensation - steps of 1/6 stop
     *
     * @param {string}  value
     */
    this.ev = function (value) {
        this.parameters['-ev'] = value;
        return this;
    };

    /**
     * Set exposure mode
     *
     * @param {string}  value  off,auto,night,nightpreview,backlight,spotlight,sports,snow,beach,verylong,fixedfps,antishake,firework
     */
    this.exposure = function (value) {
        this.parameters['-ex'] = value;
        return this;
    };

    /**
     * Set AWB mode
     *
     * @param {string}  value  off,auto,sun,cloud,shade,tungsten,fluorescent,incandescent,flash,horizo
     */
    this.awb = function (value) {
        this.parameters['-awb'] = value;
        return this;
    };

    /**
     * Set image effect
     *
     * @param {string}  value  none,negative,solarise,sketch,denoise,emboss,oilpaint,hatch,gpen,pastel,watercolour,film,blur,saturation,colourswap,washedout,posterise,colourpoint,colourbalance,cartoon
     */
    this.imxfx = function (value) {
        this.parameters['-ifx'] = value;
        return this;
    };

    /**
     * Set colour effect (U:V)
     *
     * @param {string}  value
     */
    this.colfx = function(value) {
        this.parameters['-cfx'] = value;
        return this;
    };

    /**
     * Set metering mode
     *
     * @param {string}  value  average,spot,backlit,matrix
     */
    this.metering = function (value) {
        this.parameters['-mm'] = value;
        return this;
    };

    /**
     * Set image rotation in degrees
     *
     * @param {int}  value  0 to 359
     */
    this.rotation = function (value) {
        this.parameters['-rot'] = parseInt(value, 10);
        return this;
    };

    /**
     * Set horizontal flip
     */
    this.hflip = function () {
        this.parameters['-hf'] = true;
        return this;
    };

    /**
     * Set vertical flip
     */
    this.vflip = function () {
        this.parameters['-vf'] = true;
        return this;
    };

    /**
     * Set region of interest
     *
     * @param {string}  value  x,y,w,d as normalised coordinates [0.0-1.0]
     */
    this.roi = function (value) {
        this.parameters['-roi'] = value;
        return this;
    };

    /**
     * Set shutter speed in microseconds
     *
     * @param {int}  value
     */
    this.shutter = function (value) {
        this.parameters['-s'] = parseInt(value, 10);
        return this;
    };

    /**
     * Set AWB gains - AWB mode must be off
     */
    this.drc = function () {
        this.parameters['-awbg'] = true;
        return this;
    };

    /**
     * Set DRC Level
     *
     * @param {string}  value
     */
    this.drc = function (value) {
        this.parameters['-drc'] = value;
        return this;
    };

    /**
     * Force recomputation of statistics on stills capture pass
     */
    this.stats = function () {
        this.parameters['-st'] = true;
        return this;
    };

    /**
     * Enable/Set annotate flags or text
     *
     * @param {string}  value
     */
    this.annotate = function (value) {
        this.parameters['-a'] = value;
        return this;
    };

    /**
     * Select stereoscopic mode
     */
    this.stereo = function () {
        this.parameters['-3d'] = true;
        return this;
    };

    /**
     * Half width/height of stereo image
     */
    this.decimate = function (value) {
        this.parameters['-dec'] = true;
        return this;
    };

    /**
     * Swap camera order for stereoscopic
     */
    this.stereoswap = function () {
        this.parameters['-3dswap'] = true;
        return this;
    };

    /**
     * Set extra annotation parameters (text size, text colour(hex YUV), bg colour(hex YUV))
     *
     * @param {string}  value
     */
    this.annotateex = function (value) {
        this.parameters['-ae'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.raw = function (value) {
        if(value===undefined)
            value="";

        this.parameters["-r"] = value;

        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.output = function (value) {
        this.filename = value;
        this.parameters['-o'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.latest = function (value) {
        this.parameters['-l'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.verbose = function(value) {
        this.parameters['-v'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.timeout = function (value) {
        this.parameters['-t'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.timelapse = function (value) {
        this.parameters['-tl'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.thumb = function (value) {
        this.parameters['-th'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.demo = function (value) {
        this.parameters['-d'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.encoding = function (value) {
        this.parameters['-e'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.exif = function (value) {
        this.parameters['-x'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.fullpreview = function (value) {
        if(value===undefined)
            value="";

        this.parameters["-fp"] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.signal = function (value) {
        this.parameters['-s'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.bitrate = function (value) {
        this.parameters['-b'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.framerate = function (value) {
        this.parameters['-fps'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.penc = function (value) {
        if(value===undefined)
            value="";

        this.parameters["-e"] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.intra = function (value) {
        this.parameters['-g'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.qp = function (value) {
        this.parameters["-qp"] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.profile = function (value) {
        this.parameters['-pf'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.inline = function (value) {
        this.parameters['-ih'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.timed = function (value) {
        this.parameters['-td'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.initial = function (value) {
        this.parameters['-i'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.segment = function (value) {
        this.parameters['-sg'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.wrap = function (value) {
        this.parameters['-wr'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.start = function (value) {
        this.parameters['-sn'] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  value
     */
    this.streamVideo = function (value) {
        this.parameters["-o - >"] = value;
        return this;
    };

    /**
     * ?
     *
     * @param {string}  directory
     */
    this.baseFolder = function (directory) {
        this.folder = directory;
        return this;
    };

    /**
     * Reset all previously set parameters
     */
    this.reset = function() {
        this.parameters = [];
    };
};
