export default {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,                 // Add the initial ordinate of the component
  zoom: 100,               // Canvas zoom percentage
  type: 'page',           // Selected element type
  index: -1,              // Selected element index
  uuid: null,             // Selected element uuid
  counter: 0,             // Counters for avoiding duplicate names when naming container copies

  originX: 0,             // The horizontal initial value of the selected component
  originY: 0,             // The vertical initial value of the selected component
  startX: 0,              // The abscissa when the mouse is down
  startY: 0,              // The ordinate when the mouse is crouched
  moving: false,          // Whether the component is being moved (the reference line is only displayed when moving the component)

  animation: [],          // Animation library
  playState: false,       // Animation playback status
  activeElement: {},      // Selected object, either component or page
  page: {
    page: true,
    title: 'page',    // Page title
    height: 938,           // Canvas height
    width: 1500,
    endTime: new Date(),   // deadline
    backgroundColor: '#fff'
  },
  widgets: [],            // element
  toolbarIndex: 1,
  scripts: [{script: ''},{script: ''}],
  styles: [{style: ''},{style: ''}],
  viewMode: -1,
  isEdit: 1,
  isSection: 1,
  fontFamily: ['Abrill Fatfave', 'Amaranth', 'Amatic SC', 'Arial', 'Arial Black', 'Arimo', 'Arvo', 'Bitter', 'Courgette', 'Dosis', 'Droid Sans', 'Exo 2', 'Flamenco', 'Impact', 'Josefin Sans', 'Josefin Slab', 'Kalam', 'Lato', 'Maven Pro', 'Merriweather', 'Montserrat', 'Open Sans', 'Oswald', 'PT Sans', 'PT Serif', 'Roboto', 'Special Elite', 'Tahoma', 'Times New Roman', 'Titillium Web', 'Trocchi', 'Ubuntu', 'Ultra', 'Varela Round', 'Varela Round', 'Verdana', 'Volkorn', 'Yanone Kaffeesatz']
}
