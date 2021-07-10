# ayo-vaksin-yk

https://ayo-vaksin-yk.netlify.app/

Daftar lokasi vaksin COVID di Provinsi Daerah Istimewa Yogyakarta.

- Filter berdasarkan kota/kabupaten dan kelompok umur
- Cari vaksin tanpa syarat domisili (KTP mana saja tanpa surat keterangan)
- Lihat poin-poin penting (syarat, cara mendaftar, info kontak) dan lakukan tindakan (satu klik untuk telepon, buka online form, kirim WA, buka peta)

Website ini bertujuan memberi alternatif sumber informasi bagi masyarakat yang berminat untuk vaksin. Khususnya dengan menyediakan platform yang:

- Ringan, cepat, tidak perlu login/buat akun sosmed, tidak ada iklan
- Dapat diakses dengan *screen reader* untuk pengguna tuna netra (baru dicoba dengan VoiceOver MacOS)
- Dapat diinstall sebagai PWA yang dapat diakses dari *home screen* (browser tertentu)
- Dapat diakses offline (browser tertentu)


## Sumber Informasi

Informasi didapat dari berbagai sumber, antara lain:
- [Thread Twitter @flafea](https://twitter.com/flafea/status/1406119208501481486)
- [Instagram @infovaksinjogja](https://www.instagram.com/infovaksinjogja/)
- Tweet/post/artikel online lainnya dan komunikasi personal

Sebisa mungkin saya melakukan crosscheck informasi dan melampirkan sumber akun resmi faskes bersangkutan. Jika ada informasi yang tidak tepat, harap email ke ayo.vaksin.yk@eka.fyi.

Website ini hanya menampilkan vaksin gratis dari fasilitas kesehatan atau instansi resmi.

### Kenapa tidak ada Puskesmas?

Untuk saat ini, website ini berfokus pada faskes *selain* Puskesmas karena umumnya masing-masing Puskesmas melayani warga yang ber-KTP atau keterangan domisili wilayah tersebut. Silakan cari dan hubungi Puskesmas terdekat di lokasimu untuk informasi vaksin.

Pada kenyataannya, Puskesmas punya keterbatasan dalam melayani warga, baik dari kuota atau regulasi daerah. Faskes-faskes di website ini dapat menjadi alternatif peminat vaksin yang belum terakomodasi Puskesmas terdekat.


## Roadmap

Konten:
- Melengkapi informasi Kab. Bantul, Kulon Progo, Gunungkidul

Rencana fitur:
- *(tentatif)* User dapat submit lokasi baru
- *(tentatif)* Share (kirim atau simpan ke aplikasi ponsel, cth. Notes)
- *(tentatif)* Halaman Puskesmas (cari Puskesmas terdekat dari user)
- *(tentatif)* Push notifikasi jika ada lokasi baru
- *(tentatif)* Sortir berdasarkan tanggal update terbaru

Silakan vote fitur yang menurutmu penting di halaman [Discussions](https://github.com/ekafyi/ayo-vaksin-yk/discussions).


## Stack

Website ini menggunakan Airtable sebagai sumber data dan Pipedream untuk memproses data, 

- SvelteKit — UI framework
- XState — state management
- Netlify — hosting + CI/CD
- Pipedream — magic~ 🎩✨ 
- Workbox — PWA caching strategies
- Tailwind, TypeScript


## Developing

(IN PROGRESS)


## Contributing

(IN PROGRESS)


## Acknowledgment

- Image credits
	- Favicon by [Freepik](https://www.freepik.com/)
	- Handwashing illustration (offline page) by [Monkik](https://www.flaticon.com/authors/monkik)

  
## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2021-present, Eka <me@eka.fyi>