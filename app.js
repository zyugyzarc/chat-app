
class App extends Component{

	constructor(dom){

		super(dom, {
			style: `
			this{
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: row-reverse;
			}
			`,
			HTML: `
				<div class=panel>
					Username: <input id=uname><br>
					RoomId: <input id=roomid><br>
					<button onclick="this.connect()">Connect</button>
				</div>
				<div component=Chat args=[]></div>
			`
		})

		window.components[1].setparent(this)

	}

	connect(){
		this.chat.connect()
	}

	connected(){
		let t= this
		let button = document.createElement('button')
		button.onclick = ()=>{t.chat.reconnect()}
		button.innerHTML = 'Search peers'
		this.elem('button').setAttribute('disabled', 0)
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
				displa: flex;
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