import sharp from 'sharp'

export async function processHalftoneImage(
  imageUrl: string,
  size: number = 400,
  spacing: number = 3,
  dotSize: number = 2,
  shape: string = 'circle',
  format: string = 'png',
  uniformSize: boolean = false
): Promise<Buffer | string> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }
    const imageBuffer = Buffer.from(await response.arrayBuffer())

    // Process with Sharp: resize to square, convert to grayscale
    const processedImage = await sharp(imageBuffer)
      .resize(size, size, { fit: 'cover' })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const { data, info } = processedImage

    // Create SVG for halftone dots
    let svgContent = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`
    svgContent += `<rect width="100%" height="100%" fill="#000000"/>`

    // Generate halftone dots based on pixel brightness
    for (let y = 0; y < size; y += spacing) {
      for (let x = 0; x < size; x += spacing) {
        if (x < info.width && y < info.height) {
          const pixelIndex = y * info.width + x
          const brightness = data[pixelIndex] / 255

          // Boost contrast
          const adjustedBrightness = Math.pow(brightness, 0.8) * 1.2

          // Map brightness to green color
          let color
          if (adjustedBrightness > 0.95) {
            color = '#85e0b7' // brightest green
          } else if (adjustedBrightness > 0.8) {
            color = '#3ecf8e'
          } else if (adjustedBrightness > 0.65) {
            color = '#3ecf8e'
          } else if (adjustedBrightness > 0.45) {
            color = '#37996b'
          } else if (adjustedBrightness > 0.35) {
            color = '#15593b'
          } else if (adjustedBrightness > 0.25) {
            color = '#0c3925'
          } else if (adjustedBrightness > 0.15) {
            color = '#072719'
          } else {
            color = '#041c11'
          }

          // Calculate dot radius - use dotSize parameter to control overall size
          const maxRadius = (spacing / 1.6) * (dotSize / 2) // Scale by dotSize
          const minRadius = 0.7 * (dotSize / 2) // Scale minimum radius by dotSize
          const radius = minRadius + (maxRadius - minRadius) * adjustedBrightness

          if (radius > 0.2) {
            if (shape === 'square') {
              let squareSize
              if (uniformSize) {
                // Uniform squares - only color changes based on brightness
                squareSize = spacing * 0.8 * (dotSize / 2)
              } else {
                // Variable squares - size changes based on brightness
                squareSize = radius * 1.6
              }
              const halfSquare = squareSize / 2
              const squareX = x + spacing / 2 - halfSquare
              const squareY = y + spacing / 2 - halfSquare
              svgContent += `<rect x="${squareX}" y="${squareY}" width="${squareSize}" height="${squareSize}" fill="${color}"/>`
            } else {
              // Circles
              if (uniformSize) {
                // Uniform circles - only color changes based on brightness
                const uniformRadius = (spacing / 2.5) * (dotSize / 2)
                svgContent += `<circle cx="${x + spacing / 2}" cy="${
                  y + spacing / 2
                }" r="${uniformRadius}" fill="${color}"/>`
              } else {
                // Variable circles - size changes based on brightness (traditional halftone)
                svgContent += `<circle cx="${x + spacing / 2}" cy="${
                  y + spacing / 2
                }" r="${radius}" fill="${color}"/>`
              }
            }
          }
        }
      }
    }

    svgContent += '</svg>'

    if (format === 'svg') {
      return svgContent
    }

    // Convert SVG to PNG using Sharp
    const finalImage = await sharp(Buffer.from(svgContent)).png().toBuffer()

    return finalImage
  } catch (error) {
    console.error('Error processing halftone image:', error)
    throw error
  }
}
