
class App extends Component{

	constructor(dom){

		super(dom, {
			style: `

			@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900');

			body{
				margin: 0;
				font-family: "Lato", sans-serif;
			}
			this{
				width: 100%;
				height: 100%;
				color: #fff;
				background: #111;
			}

			this div[component=Chat]{
				width: 100%;
				height: 100%;
			}

			this div.panel{
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translate(50%, -50%);
				background: #333;
				padding: 1rem;
				border-radius: 3px;
				transition-duration: 0.5s;
				transition-timing-function: ease-in-out;
			}

			this div.panel<this.state.connected>{
				transform: translate(0%, 0%);
				top: 0;
				right: 0;
			}

			this input, this button{
				background-color: #222;
				color: #fff;
				border: 2px solid #444;
				border-radius: 3px;
				padding: 3px;
			}

			this button{
				padding: 5px;
				padding-left: 10px;
				padding-right: 10px;
				border-radius: 10px;
			}

			this button:hover{
				background-color: #333;
			}

			this button[disabled]{
				background-color: #222;
				color: #888;
			}

			`,
			HTML: `
				<div class=panel>
					Username: <input id=uname><br>
					Room Id: <input id=roomid><br>
					<button onclick="this.connect()">Connect</button>
				</div>
				<div component=Chat args=[]></div>
			`
		})

		window.components[1].setparent(this)
		this.state.connected = false

	}

	connect(){
		this.chat.connect()
	}

	connected(){
		let t= this
		let button = document.createElement('button')
		button.onclick = ()=>{t.chat.reconnect()}
		button.innerHTML = 'Search peers'
		this.elem('button').setAttribute('disabled')
		this.elem('.panel').appendChild(button)
	}

}

class Chat extends Component{

	constructor(dom){

		super(dom, {
			style: `
			this {
				width: 100%;
				display: flex;
				flex-direction: column;
			}
			this p{
				height: 100%
			}
			this div{
				display: flex;
			}
			this #msgbox{
				flex: 1;
			}

			this div <this.state.connected == false>{
				filter: blur(5px);
			}

			`,
			HTML: `
				<p dynamic>{{this.state.chatlog}}</p>
				<div>
					<input id=msgbox disabled>
					<button onclick="this.send()" disabled>Send</button>
				</div>
			`
		})

		this.state.chatlog = ""
		this.state.connected = false

	}

	setparent(p){
		this.parent = p
		p.chat = this
	}

	connect(){
		
		this.node = new Node(
			document.querySelector('#uname').value
		)

		let t = this
		this.node.onready = ()=>{t.onready()}
		this.node.onevent = x=>{t.onevent(x)}

		this.node.connectRoom(
			document.querySelector('#roomid').value
		)

	}

	reconnect(){
		this.node.connectRoom(this.node.room, true)
	}

	onready(){

		this.parent.state.connected = true
		this.state.connected = true

		this.elem('#msgbox').removeAttribute('disabled')
		this.elem('button').removeAttribute('disabled')
		this.state.chatlog += "Connected!<br>"

		this.parent.connected()

		this.node.broadcast({
			author: this.node.id,
			type: 'system-message',
			message: `${this.node.id} joined the chat!`})
	}

	onevent(data){
		if(data.type === 'system-message'){
			this.state.chatlog += data.message + '<br>'
		}
		else{
			this.state.chatlog += `${data.author}: ${data.message}<br>`
		}
	}

	send(msgtype){
  
		this.state.chatlog += `${this.node.id}: ${this.elem('#msgbox').value}<br>`

		this.node.broadcast({
			author: this.node.id,
			broadcast: true,
			message: this.elem('#msgbox').value})
	}

}