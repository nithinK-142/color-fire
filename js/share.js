function downloadFavoriteColors() {
  
    favoriteColorRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = 'favorite_colors.json';
      link.click();
  
      // Clean up the dynamically created link
      setTimeout(() => {
        URL.revokeObjectURL(url);
        link.remove();
      }, 0);
    });
  }
  
  const shareLink = document.getElementById('share');
  shareLink.addEventListener('click', downloadFavoriteColors);
  