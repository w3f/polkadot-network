main ={

    dotCanvas: null,
    dotContext: null,
    canvasWidth:null,
    canvasHeight:null,
    dotRadius: null,
    dotRange: null,
    dotsXNumber: null,
    dotsYNumber: null,
    //borderOffset: null,
    dots: [],
    stage: null,
    stage0to1probability: 0.5, //w procentach
    stage1and3lenght: 10, //ilosc klatek animacji (przy 60fps)
    stage2splitSize: 2,
    stallTime: [10, 90],

    init: function(){
        //main.stage = new createjs.Stage("dots");

        main.dotCanvas= document.querySelector("#dots");
        main.dotContext= main.dotCanvas.getContext("2d");

        main.resizeCanvas();
        main.addEvent(window, "resize", main.resizeCanvas );
        main.animateDots();
        main.initForm();
    },

    initForm: function()
    {
        console.log('x');
          $('#leadGenForm').on('submit', function(e){
              e.preventDefault();
              if (main.validateForm()) {
                  $.ajax($(this).attr('action'), {
                      type: 'post',
                      data: { email: $(this).find('#email').val() },
                      success: function(res) {
                          console.log(res);
                          document.querySelector(".error-message").classList.remove("show");
                          document.querySelector(".limiter-message").classList.remove("show");
                          document.querySelector(".info-message").classList.add("show");
                      },
                      error: function() {
                          document.querySelector(".error-message").classList.remove("show");
                          document.querySelector(".limiter-message").classList.add("show");
                          document.querySelector(".info-message").classList.remove("show");
                      }
                  });
              }
          });
    },

    validateForm: function(){

        var email = document.getElementById("email").value;

        document.querySelector(".limiter-message").classList.remove("show");
        if (main.validateEmail(email) == false) {
            if ($('.error-message').hasClass("show")) {
                for (i = 0; i < 3; i++) {
                    $('.error-message').fadeTo('slow', 0.5).fadeTo('slow', 1.0);
                }
            } else {
                document.querySelector(".error-message").classList.add("show");
                document.querySelector(".info-message").classList.remove("show");
            }
            return false;
        } else {
            document.querySelector(".error-message").classList.remove("show");
            return true;
        }
    },

    validateEmail: function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    focus: function(){
        document.querySelector(".error-message").classList.remove("show");
    },

    animateDots: function(){
        var requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;

        if (typeof requestAnimationFrame == 'function'){
            return requestAnimationFrame(main.drawFrame);
        }
        console.log('animation not supported');
        main.drawFrame();

    },

    addEvent: function(object, type, callback) {
        if (object == null || typeof(object) == 'undefined') return;
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
        } else if (object.attachEvent) {
            object.attachEvent("on" + type, callback);
        } else {
            object["on"+type] = callback;
        }
    },

    resizeCanvas: function(){
        var height = window.innerHeight,
            width = window.innerWidth;

        if (window.devicePixelRatio >1){
            main.dotCanvas.width = width*2;
            main.dotCanvas.height = height*2;
            main.canvasWidth = width*2;
            main.canvasHeight= height*2;

            main.dotCanvas.getContext('2d').scale(2,2);
        }
        else {
            main.dotCanvas.width = width;
            main.dotCanvas.height = height;
            main.canvasWidth = width;
            main.canvasHeight= height;
        }

        if (width < 767){
            main.dotRadius = 7;
            main.dotRange = 23;
            //main.borderOffset = 4;
        }
        else {
            main.dotRadius = 11;
            main.dotRange = 36;
            //main.borderOffset = 16;
        }

        //tworzenie/update tablicy z punktami
        main.dotsXNumber = Math.ceil(main.canvasWidth/main.dotRange);
        main.dotsYNumber = Math.ceil(main.canvasHeight/main.dotRange);

        var dotsNumber = main.dotsXNumber*main.dotsYNumber;
        //var dotsNumber = 1;

        main.updateDots(dotsNumber);

    },

    updateDots: function(dotsNumber){
        if ( main.dots.length == 0 ){
            for ( var i = 1; i <= dotsNumber; i++ ){
                var dot = main.getDotPosition(i);
                dot.flag = 0;

                main.dots[i] = dot;
            }
        }
        else if(main.dots.length < dotsNumber) {
            for ( var i = 1; i <= dotsNumber; i++ ){
                var dot = main.getDotPosition(i);
                if( main.dots[i] ){
                    dot.flag = main.dots[i].flag;
                    dot.progress = main.dots[i].progress;
                } else {
                    dot.flag = 0;
                    dot.progress = 0;
                }

                main.dots[i] = dot;
            }
        }
        else {
            var dots = [];
            for ( var i = 1; i <= dotsNumber; i++ ){
                var dot = main.getDotPosition(i);

                if( main.dots[i] ){
                    dot.flag = main.dots[i].flag;
                    dot.progress = main.dots[i].progress;
                } else {
                    dot.flag = 0;
                    dot.progress = 0;
                }

                dots[i] = dot;
            }
            main.dots = dots;
        }
    },

    getDotPosition: function(index){
        var pos = { x: null, y: null};

        pos.x = ((index-1) % main.dotsXNumber) * main.dotRange + Math.round(main.dotRange/2);
        pos.y = (Math.ceil(index/main.dotsXNumber) -1) * main.dotRange + Math.round(main.dotRange/2);
        //pos.x = ((index-1) % main.dotsXNumber) * main.dotRange + Math.round(main.dotRange/2) + main.borderOffset;
        //pos.y = (Math.ceil(index/main.dotsXNumber) -1) * main.dotRange + Math.round(main.dotRange/2) + main.borderOffset;


        //console.log(pos);
        return pos;
    },

    drawFrame: function() {

        main.dotContext.clearRect(0, 0, main.canvasWidth, main.canvasHeight);

        // color in the background
        main.dotContext.fillStyle = "#fff8ec";

        main.dotContext.fillRect(0, 0, main.canvasWidth, main.canvasHeight);

        if( main.dots.length ==0 ){
            return;
        }

        for (var i = 1; i < main.dots.length; i++){
            main.drawDot(main.dots[i]);
        }

        //console.log('xxxxxxxxx');

        main.animateDots();
    },

    drawDot: function(dot){

        //console.log(dot);

        switch (dot.flag) {
            case 0:
                main.drawStage0Dot(dot);
                break;
            case 1:
                main.drawStage1Dot(dot);
                break;
            case 2:
                main.drawStage2Dot(dot);
                break;
            case 3:
                main.drawStage3Dot(dot);
                break;
        }


    },

    drawStage0Dot: function(dot){
        main.dotContext.beginPath();

        main.dotContext.arc(dot.x, dot.y, main.dotRadius, 0, Math.PI * 2, false);
        main.dotContext.closePath();

        // color dot
        main.dotContext.fillStyle = "#fff8ec";
        main.dotContext.fill();

        // stroke
        main.dotContext.lineWidth = 1;
        main.dotContext.strokeStyle = '#edb477';
        main.dotContext.stroke();

        if ( Math.random() < main.stage0to1probability/100 ){
            dot.flag = 1;
            dot.progress = 0;
        }
    },
    drawStage1Dot: function(dot){

        dot.progress += 100/main.stage1and3lenght;
        var f = dot.progress/100;

        //wypelniona kropka
        main.dotContext.beginPath();

        main.dotContext.arc(dot.x+(main.stage2splitSize*f), dot.y+(main.stage2splitSize*f), main.dotRadius, 0, Math.PI * 2, false);
        main.dotContext.closePath();

        // color dot
        main.dotContext.fillStyle = "#edb477";
        main.dotContext.fill();

        // stroke
        main.dotContext.lineWidth = 1;
        main.dotContext.strokeStyle = '#edb477';
        main.dotContext.stroke();

        //pusta kropka
        main.dotContext.beginPath();

        main.dotContext.arc(dot.x-(main.stage2splitSize*f), dot.y-(main.stage2splitSize*f), main.dotRadius, 0, Math.PI * 2, false);
        main.dotContext.closePath();

        // color dot
        main.dotContext.fillStyle = "#fff8ec";
        main.dotContext.fill();

        // stroke
        main.dotContext.lineWidth = 1;
        main.dotContext.strokeStyle = '#edb477';
        main.dotContext.stroke();

        if( dot.progress >= 100 ) {
            dot.flag = 2;
            dot.progress = Math.floor(Math.random() * main.stallTime[1]) + main.stallTime[0];

            return;
        }
    },
    drawStage2Dot: function(dot){

        //
        //if (dot.progress > 0) {
        //    console.log(dot.progress);
        //    throw  'x';
        //
        //}

        dot.progress--;

        //wypelniona kropka
        main.dotContext.beginPath();

        main.dotContext.arc(dot.x+(main.stage2splitSize), dot.y+(main.stage2splitSize), main.dotRadius, 0, Math.PI * 2, false);
        main.dotContext.closePath();

        // color dot
        main.dotContext.fillStyle = "#edb477";
        main.dotContext.fill();

        // stroke
        main.dotContext.lineWidth = 1;
        main.dotContext.strokeStyle = '#edb477';
        main.dotContext.stroke();

        //pusta kropka
        main.dotContext.beginPath();

        main.dotContext.arc(dot.x-(main.stage2splitSize), dot.y-(main.stage2splitSize), main.dotRadius, 0, Math.PI * 2, false);
        main.dotContext.closePath();

        // color dot
        main.dotContext.fillStyle = "#fff8ec";
        main.dotContext.fill();

        // stroke
        main.dotContext.lineWidth = 1;
        main.dotContext.strokeStyle = '#edb477';
        main.dotContext.stroke();

        if( dot.progress <= 0 ) {
            dot.flag = 3;
            dot.progress = 0;

            return;
        }
    },
    drawStage3Dot: function(dot){

        dot.progress += 100/main.stage1and3lenght;

        var f = (100-dot.progress)/100;

        //wypelniona kropka
        main.dotContext.beginPath();

        main.dotContext.arc(dot.x+(main.stage2splitSize*f), dot.y+(main.stage2splitSize*f), main.dotRadius, 0, Math.PI * 2, false);
        main.dotContext.closePath();

        // color dot
        main.dotContext.fillStyle = "#edb477";
        main.dotContext.fill();

        // stroke
        main.dotContext.lineWidth = 1;
        main.dotContext.strokeStyle = '#edb477';
        main.dotContext.stroke();

        //pusta kropka
        main.dotContext.beginPath();

        main.dotContext.arc(dot.x-(main.stage2splitSize*f), dot.y-(main.stage2splitSize*f), main.dotRadius, 0, Math.PI * 2, false);
        main.dotContext.closePath();

        // color dot
        main.dotContext.fillStyle = "#fff8ec";
        main.dotContext.fill();

        // stroke
        main.dotContext.lineWidth = 1;
        main.dotContext.strokeStyle = '#edb477';
        main.dotContext.stroke();


        if( dot.progress >= 100 ) {
            dot.flag = 0;
            dot.progress = 0;

            return;
        }
    },

    createDots: function(){

        console.log('stworz');

        var xNumber = Math.ceil(main.canvasWidth/main.dotRange),
            yNumber = Math.ceil(main.canvasHeight/main.dotRange);

        for (var i = 0; i < xNumber; i++){

            for (var j = 0; j < yNumber; j++) {
                var circle = new createjs.Shape();
                circle.graphics.beginStroke("#edb477").beginFill("#fff8ec").drawCircle(0, 0, main.dotRadius);
                circle.x = main.dots[i][j].x;
                circle.y = main.dots[i][j].y;
                main.stage.addChild(circle);
            }
        }

        main.stage.update();
    }

};