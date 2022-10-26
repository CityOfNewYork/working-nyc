<?php

namespace NYCO;

class OgImage {
  public $header = 'Content-Type: image/png';

  public $quality = 9;

  public $w = 1200;

  public $h = 628;

  public $grid = 8;

  public $margin = 10; // multiplier for margin; $grid * $margin

  public $color = array(18, 47, 90); // Scale default 4 (light mode)

  public $verticalAlign = 'top';

  public $fontRegular = __DIR__ . '/assets/PublicSans-Regular.ttf';

  public $fontBold = __DIR__ . '/assets/PublicSans-Bold.ttf';

  public $fontSizeLarge = 38;

  public $lineHeightLarge = 1.4;

  public $wrapLarge = 26;

  public $fontSizeSmall = 18;

  public $lineHeightSmall = 1.6;

  public $wrapSmall = 50;

  public $preText = '';

  public $title = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor';

  public $subtitleBold = 'Incididunt ut labore et dolore';

  public $subtitle = 'Magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris';

  public $backgroundImg = __DIR__ . '/assets/background.png';

  public $logoImg = __DIR__ . '/assets/logo.png';

  /**
   * Construct the instance
   *
   * @return  Object  Instance of OgImage
   */
  public function __construct() {
    return $this;
  }

  /**
   * Create the image by composing layers and adding text.
   *
   * @return  Object  Instance of OgImage
   */
  public function create() {
    /**
     * Background
     */

    $this->background = imagecreatefrompng($this->backgroundImg);

    /**
     * Logo
     */

    $this->logo = imagecreatefrompng($this->logoImg);

    imagealphablending($this->logo, true);

    imagesavealpha($this->logo, true);

    /**
     * Compose background and logo layers
     */

    $this->image = imagecreatetruecolor($this->w, $this->h);

    imagecopy($this->image, $this->background, 0, 0, 0, 0, $this->w, $this->h);

    imagecopy($this->image, $this->logo, 0, 0, 0, 0, $this->w, $this->h);

    /**
     * Text
     */

    $this->text = imagecreatetruecolor($this->w, $this->h);

    $color = imagecolorallocate($this->text, $this->color[0], $this->color[1], $this->color[2]);

    $this->textColor = $color;

    /**
     * Pre-title Text
     */

    $this->preText = wordwrap($this->preText, $this->wrapSmall, "\n");

    $preTextHeight = $this->bounds($this->fontSizeSmall, $this->fontBold, $this->preText)['height'];

    $preTextLineHeight = $this->fontSizeSmall * $this->lineHeightSmall;

    /**
     * Title
     */


    $this->titleImg = $this->blockText($this->fontSizeLarge, $this->fontBold, $this->lineHeightLarge, $this->wrapLarge, $this->title);

    $titleHeight = ($this->title) ? $this->titleImg['height'] : 0;

    $titleLineHeight = ($this->title) ? $this->titleImg['lineHeight'] : 0;

    /**
     * Subtitle (bold)
     */

    $this->subtitleBoldImg = $this->blockText($this->fontSizeSmall, $this->fontBold, $this->lineHeightSmall, $this->wrapSmall, $this->subtitleBold);

    $subtitleBoldHeight = ($this->subtitleBold) ? $this->subtitleBoldImg['height'] : 0;

    $subtitleBoldLineHeight = ($this->subtitleBold) ? $this->subtitleBoldImg['lineHeight'] : 0;

    /**
     * Subtitle (regular)
     */

    $this->subtitleImg = $this->blockText($this->fontSizeSmall, $this->fontRegular, $this->lineHeightSmall, $this->wrapSmall, $this->subtitle);

    $subtitleHeight = ($this->subtitle) ? $this->subtitleImg['height'] : 0;

    $subtitleLineHeight = ($this->subtitle) ? $this->subtitleImg['lineHeight'] : 0;

    /**
     * Alignment
     */

    $margin = $this->grid * $this->margin;

    $marginBottom = $this->grid * 3;

    $startTop = $margin;

    $startMiddle = ($this->h / 2) - (($titleHeight + $subtitleBoldHeight + $subtitleHeight + $marginBottom) / 2);

    $startBottom = $this->h - $margin - $titleHeight - $subtitleBoldHeight - $subtitleHeight;

    /**
     * Add Text to Image
     */

    if ('top' != $this->verticalAlign) {
      $startPreText = $margin + $preTextLineHeight;

      imagettftext($this->image, $this->fontSizeSmall, 0, $margin, $startPreText, $color, $this->fontBold, $this->preText);
    }

    if ('top' === $this->verticalAlign) {
      $titleY = $startTop;
    }

    if ('middle' === $this->verticalAlign) {
      $titleY = $startMiddle;
    }

    if ('bottom' === $this->verticalAlign) {
      $titleY = $startBottom;
    }

    imagecopy($this->image, $this->titleImg['image'], $margin, $titleY, 0, 0, $this->w, $this->h);

    $subtitleBoldY = $titleY + $titleHeight + $marginBottom;

    imagecopy($this->image, $this->subtitleBoldImg['image'], $margin, $subtitleBoldY, 0, 0, $this->w, $this->h);

    $subtitleY = $subtitleBoldY + $subtitleBoldHeight;

    imagecopy($this->image, $this->subtitleImg['image'], $margin, $subtitleY, 0, 0, $this->w, $this->h);

    // Return the instance containing the image

    return $this;
  }

  /**
   * Gets the width and height of a text box set in imagettfbbox.
   *
   * @param   Number  $fontSize  Size of the font for the text
   * @param   String  $font      Path to font file to use for the text
   * @param   String  $text      The text to use for the block
   *
   * @return  Array              The width and height of the text
   */
  public function bounds($fontsize, $font, $text) {
    $dimensions = imagettfbbox($fontsize, 0, $font, $text);

    $ascent = abs($dimensions[7]);
    $descent = abs($dimensions[1]);

    $width = abs($dimensions[0]) + abs($dimensions[2]);
    $height = $ascent + $descent;

    return array(
      'width' => $width,
      'height' => $height
    );
  }

  /**
   * Create an image text block by breaking up lines of text and placing them
   * in an image using a line height calculation. It creates a more consistent
   * line height for wrapped text than standard word wrapping and imagettftext
   * alone.
   *
   * @param   Number  $fontSize           Size of the font for the text
   * @param   String  $font               Path to font file to use for the text
   * @param   Number  $lineHeight         Line height in decimal format
   * @param   Number  $wrap               The character to wrap the text
   * @param   String  $text               The text to use for the block
   *
   * @return  Array                       Containing the image, image height, and calculated line height of the text
   */
  public function blockText($fontSize, $font, $lineHeight, $wrap, $text) {
    $lines = explode("\n", wordwrap($text, $wrap, "\n"));

    $lineHeight = $fontSize * $lineHeight;

    $image = imagecreatetruecolor($this->w, $this->h);

    imagesavealpha($image, true);

    $transparent = imagecolorallocatealpha($image, 0, 0, 0, 127);

    imagefill($image, 0, 0, $transparent);

    foreach ($lines as $index => $line) {
      imagettftext($image, $fontSize, 0, 0, $lineHeight * ($index + 1) - $this->grid, $this->textColor, $font, $line);
    }

    return array(
      'image' => $image,
      'height' => $lineHeight * count($lines),
      'lineHeight' => $lineHeight
    );
  }

  /**
   * Destroy instance images
   *
   * @return  Object  Instance of OgImage
   */
  public function destroy() {
    imagedestroy($this->background);
    imagedestroy($this->logo);
    imagedestroy($this->text);
    imagedestroy($this->titleImg['image']);
    imagedestroy($this->subtitleBoldImg['image']);
    imagedestroy($this->subtitleImg['image']);
    imagedestroy($this->image);

    return $this;
  }
}
