#!/usr/bin/env node

const program = require('commander')
const ora = require('ora')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegStatic = require('ffmpeg-static')
const path = require('path')
const asciify = require('asciify')
const commandExists = require('command-exists').sync

const ascii = text => new Promise(resolve => {
  return asciify(text, { font:'larry3d' },  (err, output) => {
    return resolve(output)
  })
})

ffmpeg.setFfmpegPath(ffmpegStatic.path)

program
  .version('1.0.0', '-v, --version')
  .arguments('[gif]')
  .description('Convert a gif to an mp4 file')
  .action(async (gif) => {
    const header = await ascii('@brightleaf')
    console.info(header)
    const appname = await ascii('   g2v')
    console.info(appname)
    if (!commandExists('ffmpeg')) {
      console.warn('FFMPEG is not installed')
      console.warn('Please install FFMPEG and try again')
      process.exit(0)
    }
    const gifFile = path.join(process.cwd(), gif)
    const vid = gifFile.replace('.gif', '.mp4')
    const spinner = ora('Converting gif').start()

    ffmpeg(gifFile)
      .inputFormat('gif')
      .outputOptions(['-pix_fmt yuv420p', '-movflags frag_keyframe+empty_moov', '-movflags +faststart'])
      .toFormat('mp4')
      .keepDAR()
      .save(vid)
      .on('error', function(err) {
        console.error('An error occurred: ' + err.message);
      })
      .on('end', function() {
        spinner.succeed('Complete');
      })
  })

program.parse(process.argv)