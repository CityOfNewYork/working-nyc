<?php foreach ($warnings as $msg): ?>
	<div class="error inline"><p><?php echo wp_kses_post($msg); ?></p></div>
<?php endforeach ?>