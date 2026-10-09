const track = document.getElementById("track");
const sampul = document.getElementById("sampul");
const isiSampul = document.getElementById("isiSampul");
const kontrol = document.getElementById("kontrol");
const titik = document.getElementById("titik");
const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");
const btnMusik = document.getElementById("musik");
const audio = document.getElementById("audio");

let index = 0;
let terbuka = false;

const el = (tag, cls, teks) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (teks !== undefined) e.textContent = teks;
  return e;
};

const romawi = (n) => {
  const peta = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let hasil = "";
  for (const [nilai, huruf] of peta) while (n >= nilai) { hasil += huruf; n -= nilai; }
  return hasil;
};

/* ---------- Sampul ---------- */
document.title = CERITA.judul;
const tombolBuka = el("button", "", CERITA.tombol);
tombolBuka.id = "buka";
isiSampul.append(
  el("h1", "", CERITA.judul),
  el("div", "garis"),
  el("p", "ket", CERITA.keterangan),
  el("p", "sub", CERITA.subjudul),
  tombolBuka
);

/* ---------- Babak ---------- */
const slides = [];

CERITA.babak.forEach((b, i) => {
  const s = el("section", "slide");
  const isi = el("div", "isi");
  isi.append(el("p", "nomor-babak", "Babak " + romawi(i + 1)), el("h2", "", b.judul));
  if (b.tanggal) isi.append(el("p", "tanggal", b.tanggal));

  b.paragraf.forEach((p, j) => {
    const t = p.trim();
    const terakhir = j === b.paragraf.length - 1;
    let kelas = "";
    if (t.startsWith('"')) kelas = "dialog";
    else if (t.startsWith("(")) kelas = "adegan";
    else if (terakhir) kelas = "akhir";
    isi.append(el("p", kelas, p));
  });

  s.append(isi);
  slides.push(s);
});

/* ---------- Penutup ---------- */
const akhir = el("section", "slide penutup");
const isiAkhir = el("div", "isi");
isiAkhir.append(
  el("h2", "", CERITA.penutup.judul),
  el("p", "teks", CERITA.penutup.teks),
  el("p", "tanda", CERITA.penutup.tanda)
);
akhir.append(isiAkhir);
slides.push(akhir);

slides.forEach((s) => track.append(s));
slides.forEach(() => titik.append(document.createElement("i")));

/* ---------- Navigasi ---------- */
function pergi(n) {
  if (!terbuka) return;
  index = Math.max(0, Math.min(slides.length - 1, n));
  track.style.transform = `translateX(-${index * 100}%)`;
  slides[index].scrollTop = 0;
  [...titik.children].forEach((t, i) => t.classList.toggle("aktif", i === index));
  btnPrev.disabled = index === 0;
  btnNext.disabled = index === slides.length - 1;
}

function bukaCerita() {
  terbuka = true;
  sampul.classList.add("buka");
  kontrol.hidden = false;
  btnMusik.hidden = false;
  putarMusik();
  pergi(0);
  setTimeout(() => { sampul.hidden = true; }, 1900);
}

tombolBuka.addEventListener("click", bukaCerita);
btnPrev.addEventListener("click", () => pergi(index - 1));
btnNext.addEventListener("click", () => pergi(index + 1));
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") pergi(index + 1);
  if (e.key === "ArrowLeft") pergi(index - 1);
});

// Geser di HP
let x0 = 0, y0 = 0;
document.addEventListener("touchstart", (e) => {
  x0 = e.touches[0].clientX;
  y0 = e.touches[0].clientY;
}, { passive: true });
document.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - x0;
  const dy = e.changedTouches[0].clientY - y0;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) pergi(index + (dx < 0 ? 1 : -1));
}, { passive: true });

/* ---------- Musik ---------- */
audio.src = CERITA.musik;
audio.volume = 0.5;

function putarMusik() {
  audio.play().then(() => btnMusik.classList.add("nyala")).catch(() => {});
}
btnMusik.addEventListener("click", () => {
  if (audio.paused) putarMusik();
  else { audio.pause(); btnMusik.classList.remove("nyala"); }
});