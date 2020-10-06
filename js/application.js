class Application
{
	constructor()
	{
		this.redactor = document.getElementById('redactor')
		this.parametrs = document.getElementById('parametrs')
		this.controls = document.getElementById('controls');
		this.downloadResult = document.getElementById('download-result');

		this.imageURL = null;

		this.debug = true;
		this.movedDot = null;
		this.dotForParametrs = null;
		if (this.debug) console.log('create application');

		this.dots = [];
		window.addEventListener('resize', this.resize.bind(this));
		window.onbeforeunload = () => { if(this.dots.length !== 0) return false;};
		document.oncontextmenu = function (){return false};
		

		this.coord = {
			x: document.getElementById('coordinat-x'),
			y: document.getElementById('coordinat-y'),
			u: document.getElementById('coordinat-u'),
			v: document.getElementById('coordinat-v'),	
		}

		if (this.debug) console.log(this.coord)

		this.crossroads = document.getElementById('crossroads');

		this.imageInput = document.getElementById('image')
		this.imageUpload =document.getElementById('upload-image')

		this.bindButtons();
	}

	bindButtons()
	{
		this.redactor.onclick = this.appendDot.bind(this)
		document.getElementById('cancel').onclick = () => 
		{
			this.parametrs.hidden = true;
			this.dotForParametrs = null;
		};
		document.getElementById('delete').onclick = () => 
		{
			this.parametrs.hidden = true;
			this.dotForParametrs.remove();
			this.dotForParametrs = null;
		};
		this.controls.firstElementChild.onclick = () => {console.log('!'), this.createFile() };
		this.redactor.onmousemove = this.moveDot.bind(this);
		this.redactor.onmouseup = this.endMoveDot.bind(this);

		for (let key in this.coord) this.coord[key].onchange = (e) => {
			if (this.dotForParametrs === null) return;
			this.dotForParametrs.setAttribute('dot-' + key, e.target.value);
		};

		this.crossroads.onchange = (e) =>{
			if (e.target.value == 0) 
			{
				this.imageInput.hidden = false;
				this.imageUpload.hidden = false;
				this.redactor.src = '';
			}
			else
			{
				this.imageInput.hidden = true;
				this.imageUpload.hidden = true;
				this.redactor.src = e.target.value;
				this.resize();
			}
		}
	}

	uploadImage(event)
	{
		event.preventDefault();
		let image = this.form.image.files[0];
		if (this.debug) console.log('upload', image)
		if (image === undefined) return;
		this.imageURL = URL.createObjectURL(image);
		this.form.hidden = true;
		this.showImage();
	}

	showImage()
	{
		this.redactor.hidden = false;
		this.controls.hidden = false;
		// this.redactor.style.backgroundImage = `url(${this.imageURL})`;
		this.redactor.src = this.imageURL;
		this.resize();
	}

	resize()
	{
		if (this.redactor.offsetWidth > document.documentElement.clientWidth) 
		{
			this.redactor.style.width = '100%';
			this.redactor.style.height = 'auto'
		}
		else 
		{
			this.redactor.style.width = 'auto';
			this.redactor.style.height = '100%';
		}
	}

	createDot(pos)
	{
		let dot = document.createElement('div')
		dot.classList.add('dot');
		dot.style.left = pos.x + 'px';
		dot.style.top = pos.y + 'px';
		dot.setAttribute('dot-x', pos.x);
		dot.setAttribute('dot-y', pos.y);
		dot.setAttribute('dot-u', '');
		dot.setAttribute('dot-v', '');
		// if (this.debug) {console.log('add dot', dot); console.dir(dot);}	
		dot.onmousedown = (event) => 
		{
			if (event.which == 3) this.showParametrs(event)
			else this.startMoveDot(event);
		};
		dot.ondragstart = () => {return false;}
		document.body.append(dot);
	}

	removeDot()
	{
		
	}

	appendDot(event)
	{
		// if (this.debug) console.log(event);
		if (this.movedDot !== null) return;
		if (event.target !== this.redactor) return;
		this.createDot({x: event.pageX-5, y: event.pageY-5})
	}

	startMoveDot(event)
	{
		this.movedDot = event.target;
		if (this.debug) console.log('mouse down', event);
		// event.stopPropagation();
		// return false;
	}

	moveDot(event)
	{
		if (this.movedDot === null) return;
		// if (this.debug) console.log('mouse move', e);
		this.movedDot.style.left = event.pageX + 'px';
		this.movedDot.style.top = event.pageY + 'px';
		// event.stopPropagation();
		// return false;
	}

	endMoveDot(event)
	{
		if (this.movedDot === null) return;
		this.movedDot.setAttribute('dot-x', parseInt(this.movedDot.style.left));
		this.movedDot.setAttribute('dot-y', parseInt(this.movedDot.style.top));
		if (this.debug) console.log('mouse up', event);
		this.redactor.onmousemove = null;
		this.redactor.onmouseup = null;
		this.movedDot = null;
		// event.stopPropagation();
		// return false;
	}

	showParametrs(event)
	{
		let pos = {x: event.pageX, y: event.pageY};
		let dot = event.target;
		this.dotForParametrs = dot;

		this.parametrs.hidden = false;
		this.parametrs.style.left = pos.x + 'px';
		this.parametrs.style.top = pos.y + 'px';
		this.coord.x.value = pos.x;
		this.coord.y.value = pos.y;
		this.coord.u.value = dot.getAttribute('dot-u');
		this.coord.v.value = dot.getAttribute('dot-u');
		return false;
	}
	get data()
	{
		if (this.debug)	console.log(dots);
		return JSON.stringify(this.dots);
	}

	createFile()
	{
		// let file = new File(new Blob([this.data], {type: 'text'}), 'coef.json');
		// let blob = new Blob([this.data]);
		let file = new File([this.data], 'coef.json', {type: 'text'})
		if (this.debug) console.log('create file', file);
		this.downloadResult.hidden = false;
		this.downloadResult.href = URL.createObjectURL(file);

	}

}

export default Application;