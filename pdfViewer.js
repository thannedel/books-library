let myState = {
  pdf: null,
  currentPage: 1,
  zoom: 1,
};

const canvas = document.getElementById('pdf_renderer'),
  ctx = canvas.getContext('2d');

if (window.innerWidth <= 600) {
  myState.zoom = 0.5;
}

if (window.innerWidth >= 600 && window.innerWidth <=1024 ) {
  myState.zoom = 1.25;
}

let url = document.location.search.replace(/^.*?\=/, '');

PDFJS.getDocument({ url })
  .then((pdf) => {
    myState.pdf = pdf;
    document.querySelector('#page-count').textContent = pdf.numPages;
    render();
  })
  .catch((err) => {
    // Display error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('#canvas_container').insertBefore(div, canvas);
    // Remove top bar
    document.querySelector('.top-bar').style.display = 'none';
    document.querySelector('#canvas_container').style.background = 'white';
  });

function render() {
  myState.pdf.getPage(myState.currentPage).then((page) => {
    const viewport = page.getViewport(myState.zoom);

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    page
      .render(renderContext)
      .then(() => {
        return page.getTextContent();
      })
      .then((textContent) => {
        let canvas_offset = document
          .querySelector('#pdf_renderer')
          .getBoundingClientRect();
        // Clear HTML for text layer
        document.querySelector('#text-layer').innerHTML = ' ';

        // Assign the CSS created to the text-layer element

        document.querySelector('#text-layer').style.left =
          canvas_offset.left + 'px';
        document.querySelector('#text-layer').style.top =
          canvas_offset.top + 'px';
        document.querySelector('#text-layer').style.height =
          canvas_offset.height + 'px';
        document.querySelector('#text-layer').style.width =
          canvas_offset.width + 'px';

        // Pass the data to the method for rendering of text over the pdf canvas.
        PDFJS.renderTextLayer({
          textContent: textContent,
          container: document.querySelector('#text-layer'),
          viewport: viewport,
          textDivs: [],
        });
      });
  });
}

document.getElementById('go_previous').addEventListener('click', (e) => {
  if (myState.pdf == null || myState.currentPage == 1) return;

  myState.currentPage--;
  document.getElementById('current_page').value = myState.currentPage;
  render();
});
document.getElementById('go_next').addEventListener('click', (e) => {
  if (myState.pdf == null || myState.currentPage >= myState.pdf.numPages)
    return;

  myState.currentPage++;
  document.getElementById('current_page').value = myState.currentPage;
  render();
});

document.getElementById('current_page').addEventListener('keypress', (e) => {
  if (myState.pdf == null) return;

  var key = e.which || e.keyCode || 0;

  if (key == 13) {
    var desiredPage = document.getElementById('current_page').valueAsNumber;
    if (desiredPage >= 1 && desiredPage <= myState.pdf.numPages) {
      myState.currentPage = desiredPage;

      document.getElementById('current_page').value = desiredPage;

      render();
    } else {
      alert("this page doesn't exist");
    }
  }
});

document.getElementById('zoom_in').addEventListener('click', (e) => {
  if (myState.pdf == null) return;
  myState.zoom = myState.zoom + 0.25;
  render();
});
document.getElementById('zoom_out').addEventListener('click', (e) => {
  if (myState.pdf == null) return;
  myState.zoom = myState.zoom - 0.25;
  render();
});

/* supported languages */
/* "be-be","be-ru","bg-ru","cs-cs","cs-en","cs-ru","da-en","da-ru",
"de-de","de-en","de-ru","de-tr","el-en","el-ru","en-cs","en-da","en-de",
"en-el","en-en","en-es","en-et","en-fi","en-fr","en-it","en-lt","en-lv","en-nl",
"en-no","en-pt","en-ru","en-sk","en-sv","en-tr","en-uk","es-en","es-es","es-ru","et-en",
"et-ru","fi-en","fi-ru","fi-fi","fr-fr","fr-en","fr-ru","hu-hu","hu-ru","it-en","it-it",
"it-ru","lt-en","lt-lt","lt-ru","lv-en","lv-ru","mhr-ru","mrj-ru","nl-en","nl-ru","no-en",
"no-ru","pl-ru","pt-en","pt-ru","ru-be","ru-bg","ru-cs","ru-da","ru-de","ru-el","ru-en",
"ru-es","ru-et","ru-fi","ru-fr","ru-hu","ru-it","ru-lt","ru-lv","ru-mhr","ru-mrj","ru-nl",
"ru-no","ru-pl","ru-pt","ru-ru","ru-sk","ru-sv","ru-tr","ru-tt","ru-uk","ru-zh","sk-en",
"sk-ru","sv-en","sv-ru","tr-de","tr-en","tr-ru","tt-ru","uk-en","uk-ru","uk-uk","zh-ru" */

/* Modal properties */
let modalTitle = document.querySelector('.modal-title');
let translations = document.querySelector('.modal-body');
translations.innerHTML = '';
modalTitle.innerHTML = '';

/* fetching for dictionary*/
function languages() {
  const languages = ['el-en', 'en-en', 'de-en', 'en-de', 'de-de'];
  languages.forEach((language) => {
    let option = document.createElement('option');

    option.setAttribute('value', language);
    option.innerHTML = language;
    var dropDownOptions = document.querySelector('#dropDownBody');
    dropDownOptions.appendChild(option);
  });
}
languages();
document.querySelector('#form').addEventListener('submit', (e) => {
  e.preventDefault();
  const text = document.querySelector('#text').value,
    APIkey =
      'dict.1.1.20200423T091725Z.f741f11e7b49bc73.d5497efee7643e9c492604ccc494e40edb685973',
    language = document.querySelector('#dropDownBody').value;
  axios
    .get(
      `
  https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${APIkey}&lang=${language}&text=${text}`
    )
    .then((res) => {
      title =
        res.data.def[0].text.charAt(0).toUpperCase() +
        res.data.def[0].text.slice(1);
      data = res.data.def[0].tr;
      console.log(data);
      console.log(res);
      dictionary();
    })
  .catch((err) => {
    // Display error
  modalTitle.append('error');
  translations.append("sorry something went wrong");
  });
});

function dictionary() {
  modalTitle.append(title);

  const wordsArray = data.map((word) => word.text);
  const wordsArrayCSV = wordsArray.join(', ');
  console.log(wordsArrayCSV);

  translations.append(wordsArrayCSV);
}

$('.modal').on('hidden.bs.modal', function () {
  $('.modal-body').html('');
  $('.modal-title').html('');
});

document.getElementById('text-layer').addEventListener('dblclick', () => {
  let pasteArea = document.getElementById('text');
  pasteArea.value = '';
  navigator.clipboard.readText().then((text) => {
    pasteArea.value = text;
    document.getElementById('text').focus();
  });
});

