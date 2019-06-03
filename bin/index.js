#!/usr/bin/env node

const program = require('commander')
const ora = require('ora')
const Ffmpeg = require('fluent-ffmpeg')
const ffmpegStatic = require('ffmpeg-static')
const path = require('path')
const asciify = require('asciify')

const ascii = text => new Promise(resolve => {
  return asciify(text, { font:'larry3d' },  (err, output) => {
    return resolve(output)
  })
})


program
  .version('2.0.1', '-v, --version')
  .arguments('[gif]')
  .description('Convert a gif to an mp4 file')
  .action(async (gif) => {
    const header = await ascii('@brightleaf')
    console.info(header)
    const appname = await ascii('   g2v')
    console.info(appname)
    const gifFile = path.join(process.cwd(), gif)
    const vid = gifFile.replace('.gif', '.mp4')
    const spinner = ora('Converting gif').start()
    const ffmpeg = new Ffmpeg(gifFile)

    ffmpeg.setFfmpegPath(ffmpegStatic.path)

    ffmpeg
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