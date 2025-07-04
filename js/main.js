<script>
  function resizeContainer() {
    const baseWidth = 1440;
    const baseHeight = 1024;
    const scaleX = window.innerWidth / baseWidth;
    const scaleY = window.innerHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);
    document.querySelector(".container").style.transform = `scale(${scale})`;
  }

  window.addEventListener('resize', resizeContainer);
  window.addEventListener('DOMContentLoaded', resizeContainer);
</script>