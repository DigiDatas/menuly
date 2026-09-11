
        
        let playlist = [];
        let currentIndex = 0;
        let loopTimeout;

        async function fetchPlaylist() {
            const { data, error } = await supabaseClient
                .from('tv_playlist')
                .select('*')
                .eq('is_active', true)
                .order('order_index', { ascending: true });
            
            if (!error && data && data.length > 0) {
                playlist = data;
                currentIndex = 0;
                playMedia();
            } else {
                document.getElementById('media-container').innerHTML = '<h1 class="text-white text-3xl font-bold">No Active Media in Playlist</h1>';
            }
        }

        function playMedia() {
            clearTimeout(loopTimeout);
            const container = document.getElementById('media-container');
            const item = playlist[currentIndex];

            if (!item) return;

            if (item.media_type === 'image') {
                container.innerHTML = `<img src="${item.media_url}" class="w-full h-full object-cover fade-in" />`;
                loopTimeout = setTimeout(nextMedia, item.duration * 1000);
            } 
            else if (item.media_type === 'video') {
                container.innerHTML = `<video src="${item.media_url}" autoplay muted class="w-full h-full object-cover fade-in"></video>`;
                const videoEl = container.querySelector('video');
                videoEl.onended = nextMedia;
                videoEl.onerror = nextMedia; 
            }
        }

        function nextMedia() {
            if (playlist.length === 0) return;
            currentIndex = (currentIndex + 1) % playlist.length;
            playMedia();
        }

        // Listen for the "Cast to TV" signal from Admin Panel
        supabaseClient.channel('tv-channel').on('broadcast', { event: 'refresh_tv' }, () => {
            fetchPlaylist();
        }).subscribe();

        // Start on boot!
        window.onload = fetchPlaylist;
  