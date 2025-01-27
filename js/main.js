
		// Global variables
		var currentStage=1;
		var previousStage=0;
		var complete=[];
		var completebg=[];
		var speed = 7; // multiplier for large canvas size
		var xOffset=2000;//2320;
		var yOffset=2000;//1720;
		var xStartPos=0;
		var yStartPos=0;
		var xPos=0;
		var yPos=0;
		
		var scale;
		var rotate;
		
		var isDragging=false;
		var isfirst=true;

		var whichPoint=0;
		var xPos1=0;
		var yPos1=0;
		var xPos2=0;
		var yPos2=0;
		var xPos3=0;
		var yPos3=0;
		var xPos4=0;
		var yPos4=0;
		
		var twoPages = false;

		// Load the Canvas & Context
		var canvas = document.getElementById('canvas');
		var context = canvas.getContext('2d');

		var canvasjaw = document.getElementById('canvasjaw');
		var context2 = canvasjaw.getContext('2d');

		var canvasoverlay = document.getElementById('canvasoverlay');
		var context3 = canvasoverlay.getContext('2d');


		var backgroundimage = new Image();
		var jawimage = new Image(); 
		var overlayimage = new Image();
		var blackJawCutout = new Image();
					
		// Create a New Image
		var imgfull = new Image();

		// image for eyes and teeth add
		var img = new Image();
		var item = '';

		var uploads=0;
		var eyes=0;
		
		//promotional video for the final frame - ensure http not https and embed style URL
		var videourl="http://www.youtube.com/embed/mjkqnU5I2Iw";
		
		
		
		function createWaiter(type) {
            
            if(["processing", "uploading"].indexOf(type) == -1) {
                return null;
            }
            
            var elem = document.getElementById(type);
            var instances = 0;
            
            return function(onDisplayed) {
                instances++;
                elem.style.display = "block";
                
                setTimeout(function() {
                    if(typeof onDisplayed == "function") {
                        onDisplayed();
                    }
                    instances--;
                    if(!instances) {
                        elem.style.display = "none";
                    }
                }, 50);
            };
        }
        var showProcessing = createWaiter("processing");
        var showUploading = createWaiter("uploading");
		
		// --------------------
		// ---- Navigation ----
		// --------------------
		// Init
		
		for (var i = 1; i <= 9; i++){
			document.getElementById("stage"+i+"EditorFrame").style.display="none";
			document.getElementById("stage"+i+"InstructionsFrame").style.display="none";
		}
		
		showStage(1);
		
		function removeAllHandlers() {
            document.getElementById('canvas').removeEventListener('mousedown', handleMouseDown);
            document.getElementById('canvas').removeEventListener('mousemove', handleMouseMove);
            document.getElementById('canvas').removeEventListener('mouseup', handleMouseUp);
            
            document.getElementById('canvas').removeEventListener('mousedown', handleMouseDownNew);
            document.getElementById('canvas').removeEventListener('mousemove', handleMouseMoveNew);
            document.getElementById('canvas').removeEventListener('mouseup', handleMouseUpNew);
            
            document.getElementById('canvas').removeEventListener('mousedown', handleMouseDownMouth);
		}
				
		function goNextStage() {
			if (complete[currentStage]==1){
			    showProcessing(function() {
    				completebg[currentStage]=canvas.toDataURL();
    				previousStage=currentStage;
    			    currentStage=currentStage+1;
    			    removeAllHandlers();
    			    hideAllStages();					
    	            showStage(currentStage);
			    });
				
			} else {
				alert ('Stage not complete!');
			}
		}

		function goPreviousStage() {
		    showProcessing(function() {
    			previousStage=currentStage;
    			currentStage=currentStage-1;
    			complete[currentStage] = 0;
    			if(completebg[currentStage - 1]) {
    			    backgroundimage.src = completebg[currentStage - 1];
    			} else {
    			    backgroundimage.src = imgfull.src;
    			}
                removeAllHandlers();
    			hideAllStages();
				showStage(currentStage);
		    });
		}

		function hideAllStages() {
			// Hide all stages
			for (var i = 1; i <= 9; i++){
				//document.getElementById("stage"+i+"EditorFrame").style.display="none";
				document.getElementById("stage"+i+"InstructionsFrame").style.display="none";
				if (i == 1 ) {
					document.getElementById("stage"+i+"EditorFrame").style.display="none";
				}
			}
		}

		function showStage(stageNum) {
			// Show the current stage editor and instructions
            document.getElementById("stage"+stageNum+"InstructionsFrame").style.display="block";
			
			// Stage 1 - Upload file/select template
			if (stageNum == 1 ) {
			    document.getElementById("stage"+stageNum+"EditorFrame").style.display="block";
			    document.getElementById("stage2EditorFrame").style.display="none";
			    if(previousStage == 2) {
			        imgfull = new Image();
			    }
			} else {
				document.getElementById("stage2EditorFrame").style.display="block";
			}
			
			// Stage 2 - Zoom/Rotate
			if (stageNum==2){
			    
			    // Add handlers
			    document.getElementById('canvas').addEventListener('mousedown', handleMouseDown);
			    document.getElementById('canvas').addEventListener('mousemove', handleMouseMove);
			    document.getElementById('canvas').addEventListener('mouseup', handleMouseUp);
			    
				document.getElementById("rotator").style.display="block";
				document.getElementById("zoomer").style.display="block";
                document.getElementById("rotator").value="0";
                document.getElementById("zoomer").value="1";
                xOffset = 0;
                yOffset = 0;
                if(previousStage==3) {
                    canvas.width = canvas.width;
                    context.drawImage(backgroundimage,0,0);
                }
                complete[2] = 1;
				//change the content
				document.getElementById("leftcolcontent").innerHTML="<p>Zoom</p>";
				document.getElementById("rightcolcontent").innerHTML="<p>Rotate</p>";
			}
			
			// Stage 3 - Fit in blue box?
			if (stageNum==3){
				document.getElementById("rotator").style.display="none";
				document.getElementById("zoomer").style.display="none";
				//change the content
				document.getElementById("leftcolcontent").innerHTML="<p></p>";
				document.getElementById("rightcolcontent").innerHTML="<p></p>";
				if(previousStage == 4) {
				    if(twoPages) {
				        reverseTwoPages();
				    }
    				canvas.width = canvas.width;
                    context.drawImage(backgroundimage,0,0);
				}
			}
			
			// Stage 4 - Left eye
			if (stageNum==4) {
				//change the content
				document.getElementById("leftcolcontent").innerHTML="<p></p>";
				document.getElementById("rightcolcontent").innerHTML="<p></p>";
				complete[4]=1;
				addEye();
			}

			// Stage 5 - Right eye
			if (stageNum==5) {
			    
			    if(previousStage==6) {
			        document.getElementById("resetMouth").style.display = "none";
			        document.getElementById("rotate").style.display = "block";
			    }
                
				//change the content
				document.getElementById("leftcolcontent").innerHTML="<p></p>";
				document.getElementById("rightcolcontent").innerHTML="<p></p>";
				complete[5]=1;
				addEye();
			}

			// Stage 6 - Draw mouth
			if (stageNum==6) {
				if (previousStage==7) {
                    document.getElementById("teeth").style.display = "none";
					resetJaw();
					
				}
                document.getElementById("rotate").style.display = "none";
                document.getElementById("resetMouth").style.display = "block";
				document.getElementById("canvas").style.cursor="pointer";
				addJaw();
			}
			
			// Stage 7 - Shoe clip and then Add teeth
			if (stageNum==7) {
			    if(previousStage == 8) {
	                document.getElementById("maskoverlay").style.display = "block";
                    document.getElementById("print").style.display = "none";
                    document.getElementById("zoom").style.display = "block";
                    document.getElementById("stage2inner").className = "editor3ColMiddle";
                    j=2500;
                    canvas.width = canvas.width;
                    context.drawImage(backgroundimage,0,0);
			    }
			    if (previousStage==6) {
	                document.getElementById("resetMouth").style.display = "none";
                    document.getElementById("rotate").style.display = "block";
					clipJaw();
				}
	            complete[7]=1; 
                document.getElementById("rotate").style.display = "none";
			    document.getElementById("teeth").style.display = "block";
			    
				//clipJaw();
			}
			
			if ((stageNum==7 && previousStage==8) || stageNum==9) {
				//canvasjaw.style.top = '80px';
				canvasjaw.style.display = 'none';
				j=2500;
			}

			// Stage 8 - Animated preview
			if (stageNum==8) {


			
                if(previousStage==9){
					document.getElementById("stage3EditorFrame").style.display="none";
                    document.getElementById("stage2EditorFrame").style.display="block";
                }

                document.getElementById("maskoverlay").style.display = "none";
                document.getElementById("teeth").style.display = "none";
                document.getElementById("zoom").style.display = "none";
                document.getElementById("stage2inner").className = "editor2ColLeft";
                document.getElementById("print").style.display = "block";
			    
				canvasjaw.style.top = '80px';
				//j=2500;
				animateJaw();
				
				/* Prepare for saving / printing */
				
				// Give the jaw image a white background
				var jawTemp = document.createElement("canvas");
                jawTemp.width = canvasjaw.width;
                jawTemp.height = canvasjaw.height / 2;
                var tmpCtx = jawTemp.getContext("2d");
                tmpCtx.fillStyle = "white";
                tmpCtx.fillRect(0,0,canvasjaw.width,canvasjaw.height / 2);
                tmpCtx.drawImage(canvasjaw, 
                    0, canvasjaw.height / 2, canvasjaw.width, canvasjaw.height / 2,
                    0, 0, canvasjaw.width, canvasjaw.height / 2
                );
                
                // Arrange face and jaw on the "save" canvas
                var save = document.getElementById("canvassave");
                var ctx = save.getContext("2d");
                if(twoPages) {
                    save.width = 1488;
                    save.height = 2890;
                    ctx.drawImage(canvas, 0, 0, 1488, 1926);
                    ctx.drawImage(jawTemp, 0, 1927, 1488, 963);
                } else {
                    ctx.drawImage(canvas, 0, 0, 1150, 1488);
                    ctx.drawImage(jawTemp, 0, 1489, 1150, 744);
                }
                
                var printImg = save.toDataURL();
                document.getElementById("printImg").src = printImg;
			}

			// Stage 9 - Print
			if (stageNum==9) {

				// RJE 1/10/14
				if (istemplate==1) {
					var html = '<img src="img/chosen-template.png" /><img id="chosenTemplatePreview" src="'+imgTemplatePreview+'">';
					document.getElementById("stage3EditorFrame").innerHTML = html;				
				}
				else {
					loadVideo();
				}

				document.getElementById("stage3EditorFrame").style.display="block";
				document.getElementById("stage2EditorFrame").style.display="none";
			}

			
			// If on stage 1 (or final and template) don't show previous button
			if (stageNum==1 || (stageNum==9 && istemplate==1) ) {
				document.getElementById("editorControlsPrevious").style.display="none";
				
			} else {
				document.getElementById("editorControlsPrevious").style.display="block";
			}
			
			// If on (final) stage 9 don't show next button
			if (stageNum==9 || stageNum==3) {			
				document.getElementById("editorControlsNext").style.display="none";
			} else {
				document.getElementById("editorControlsNext").style.display="block";			
			}			
			
			// Show the correct top 3 stage position images too
			if (stageNum<=1) {
				// Upload stage
				document.getElementById("stageUploadRed").style.display="none";
				document.getElementById("stageUploadOrange").style.display="block";
				document.getElementById("stageUploadGreen").style.display="none";
				document.getElementById("stageEditRed").style.display="block";
				document.getElementById("stageEditOrange").style.display="none";
				document.getElementById("stageEditGreen").style.display="none";
				document.getElementById("stagePreviewRed").style.display="block";
				document.getElementById("stagePreviewOrange").style.display="none";
				document.getElementById("stagePreviewGreen").style.display="none";				
			}
			
			if (stageNum>=2 && stageNum<=5) {
				// Edit stage
				document.getElementById("stageUploadRed").style.display="none";
				document.getElementById("stageUploadOrange").style.display="none";
				document.getElementById("stageUploadGreen").style.display="block";
				document.getElementById("stageEditRed").style.display="none";
				document.getElementById("stageEditOrange").style.display="block";
				document.getElementById("stageEditGreen").style.display="none";
				document.getElementById("stagePreviewRed").style.display="block";
				document.getElementById("stagePreviewOrange").style.display="none";
				document.getElementById("stagePreviewGreen").style.display="none";				
			}

			if (stageNum>=8) {
				// Preview stage
				document.getElementById("stageUploadRed").style.display="none";
				document.getElementById("stageUploadOrange").style.display="none";
				document.getElementById("stageUploadGreen").style.display="block";
				document.getElementById("stageEditRed").style.display="none";
				document.getElementById("stageEditOrange").style.display="none";
				document.getElementById("stageEditGreen").style.display="block";
				document.getElementById("stagePreviewRed").style.display="none";
				document.getElementById("stagePreviewOrange").style.display="block";
				document.getElementById("stagePreviewGreen").style.display="none";
			}

		}
		
		
		// ----------------------
		// ---- File Upload ----
		// ----------------------
		
		
		if(window.FileReader) { 
		 var drop; 
		 var fileUpload;
         var status = document.getElementById('status');
         var list   = document.getElementById('list');
		 addEventHandler(window, 'load', function() {
		    drop   = document.getElementById('drop');
		    fileUpload = document.getElementById("fileUpload");
		    function cancel(e) {
		      if (e.preventDefault) { e.preventDefault(); }
		      return false;
		    }

		    // Tells the browser that we *can* drop on this target
		    addEventHandler(drop, 'dragover', cancel);
		    addEventHandler(drop, 'dragenter', cancel);

		addEventHandler(drop, 'drop', handleFileDrop);
        addEventHandler(fileUpload, 'change', handleFileDrop);
		
		function handleFileDrop(e) {
		    
		    e = e || window.event; // get window.event if e argument missing (in IE)   
            if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.

            var files;
            if(e.type == "drop") {
                var dt    = e.dataTransfer;
                files = dt.files;
            } else if(e.type == "change") {
                files = e.target.files;
            } else {
                return;
            }
            
            showUploading(function() {
                for(var i = 0, file; file = files[i]; i++) {
                    var reader = new FileReader();

                    reader.readAsDataURL(file);
                    addEventHandler(reader, 'loadend', function(e, file) {
                        var bin = this.result;
                        imgfull.onload = function(){
                            canvasUpLoadImage();
                            goNextStage();
                        };
                        imgfull.file = file;
                        imgfull.src = bin;

                    }.bindToEventHandler(file));
                }
		    });
        }
		
		Function.prototype.bindToEventHandler = function bindToEventHandler() {
		  var handler = this;
		  var boundParameters = Array.prototype.slice.call(arguments);
		  //create closure
		  return function(e) {
		      e = e || window.event; // get window.event if e argument missing (in IE)   
		      boundParameters.unshift(e);
		      handler.apply(this, boundParameters);
		  };
		};
		  });
		} else { 
		  console.log('Your browser does not support the HTML5 FileReader.');
		  document.getElementById('status').innerHTML = 'Your browser does not support the HTML5 FileReader.';
		}
		function addEventHandler(obj, evt, handler) {
		    if(obj.addEventListener) {
		        // W3C method
		        obj.addEventListener(evt, handler, false);
		    } else if(obj.attachEvent) {
		        // IE method.
		        obj.attachEvent('on'+evt, handler);
		    } else {
		        // Old school method.
		        obj['on'+evt] = handler;
		    }
		}

		function handleMouseDown(e){
			xStartPos=parseInt(e.layerX);
			yStartPos=parseInt(e.layerY);
			isDragging=true;
			console.log(xStartPos+','+yStartPos);
	    }

		function handleMouseUp(e){
			isDragging=false;

			// Redraw canvas
			canvasLoadImage();
			
		}

	    function handleMouseMove(e){
			xStartPos=xPos;
			yStartPos=yPos;

	      xPos=parseInt(e.clientX* speed);
	      yPos=parseInt(e.clientY* speed);

	      // if the drag flag is set, clear the canvas and draw the image
	      if(isDragging){
		
				xOffset=xOffset-(xStartPos-xPos);
				yOffset=yOffset-(yStartPos-yPos);

				// Redraw canvas
				canvasLoadImage();
	      }
	    }

	    // Take event from file change & handle it
	    function doUpload(e){
	        // The user might upload multiple files, we'll take the first
	        var file = e.target.files[0];

	        // Check that there is a file uploaded
	        if(file){
	            // We need to use a FileReader to actually read the file.
	            var reader = new FileReader();

	            // When it's loaded, we'll send the image data to the canvas method
	            reader.onload = function(event){
					// Assign the image data as the source - as we are using a data URL
					imgfull.src = event.target.result;
					
	                canvasUpLoadImage();
	            };
	            // Pass the reader the file to read and give us the DataURL
	            reader.readAsDataURL(file);
	        }
	    }
	
	    function canvasUpLoadImage(){  
            //load image the first time
            canvas.width = canvas.width;
            yOffset=0;
            xOffset=0;
            context.drawImage(imgfull, 0, 0, canvas.width, imgfull.height * (canvas.width/imgfull.width));
			backgroundimage=imgfull;
            complete[1]=1;
        }
    
        function canvasLoadImage(){  
        
            var zoomer = document.getElementById('zoomer');
            var rotator = document.getElementById('rotator');

            // Empty the canvas in case there's something already on it (re-upload of image file)
            canvas.width = canvas.width;

            // Scale the image
            scale = zoomer.valueAsNumber;
            rotate = rotator.valueAsNumber*(Math.PI/180);
            
            // LD - Simplified transforms to 4 lines of code
            context.translate((canvas.width/2)+(xOffset), (canvas.height/2)+(yOffset));
            context.scale(scale,scale);
            context.rotate(rotate);
            context.translate(-(canvas.width/2), -(canvas.height/2));
            
            //RJE context.translate((canvas.width)/2, (canvas.height)/2);
			// RJE - Added offset here rather than at final draw stage to avoid moving issue if rotated 
			/*
            context.translate((canvas.width/2)+(xOffset), (canvas.height/2)+(yOffset));
            context.scale(scale,scale);
            context.translate(-(canvas.width/2), -(canvas.height/2) );
            */

            // Rotate the image
            /*
            context.translate((canvas.width)/2, (canvas.height)/2);
            context.rotate(rotate);
            context.translate(-(canvas.width)/2, -(canvas.height)/2);
            */
            //context.translate((canvas.width/2), (canvas.height/2));
            //context.translate(-(canvas.width/2), -(canvas.height/2));
            // Draw the image (scaled and proportional)
            // RJE context.drawImage(imgfull, xOffset, yOffset, canvas.width, imgfull.height * (canvas.width/imgfull.width));
			// RJE - Removed offset here (now done earlier) to avoid moving issue if rotated 
			context.drawImage(imgfull, 0, 0, canvas.width, imgfull.height * (canvas.width/imgfull.width));
			
			//mark stage as complete if editted
			if (complete[2]!=1) complete[2]=1;
        }
        
        function setTwoPages(isTwoPages) {
            twoPages = isTwoPages;
            if(twoPages) {

                document.getElementById("themask").src = "img/mask2.png";
                scale = scale * (255 / 330);
                
                canvas.width = canvas.width;
                
                context.translate((canvas.width/2)+(xOffset * (255 / 330)), (canvas.height/2)+(yOffset * (255 / 330))+(350));
                context.scale(scale,scale);
                context.rotate(rotate);
                context.translate(-(canvas.width/2), -(canvas.height/2));
                
                context.drawImage(imgfull, 0, 0, canvas.width, imgfull.height * (canvas.width/imgfull.width));
            }
            complete[3] = 1;
            goNextStage();
        }
        
        function reverseTwoPages() {
            document.getElementById("themask").src = "img/mask.png";
            twoPages = false;
        }

		// --------------------
		// ---- Mouth ----
		// --------------------

		function addJaw() {
			document.getElementById('canvas').addEventListener('mousedown', handleMouseDownMouth);

			// create background from editted image
			if(backgroundimage.src != completebg[5]) {
			    backgroundimage.onload = function(){
	                canvas.width = canvas.width;
	                context.drawImage(backgroundimage,0,0);
	                backgroundimage.onload = null;
	            };
	            backgroundimage.src = completebg[5]; 
			} else {
			    canvas.width = canvas.width;
                context.drawImage(backgroundimage,0,0);
			}
		}
		
		function handleMouseDownMouth(e){
		    if (!e) e = window.event;
		    if (e.pageX || e.pageY)   {
		        xPos = e.pageX;
		        yPos = e.pageY;
		    }
		    else if (e.clientX || e.clientY)    {
		        xPos = e.clientX + document.body.scrollLeft
		            + document.documentElement.scrollLeft;
		        yPos = e.clientY + document.body.scrollTop
		            + document.documentElement.scrollTop;
		    }
		    var offset = $("#canvas").offset();
		    xPos = Math.round(xPos - offset.left);
		    yPos = Math.round(yPos - offset.top);

			canvas.width = canvas.width;
			
			context.drawImage(backgroundimage,0,0);

			whichPoint++;
			
			switch(whichPoint) {
			    
			    case 1:
			        xPos1 = xPos * 10;
                    yPos1 = yPos * 10;
                    break;
                    
			    case 2:
			        xPos2 = xPos * 10;
                    yPos2 = yPos * 10;
                    break;
                    
			    case 3:
                    xPos3 = xPos * 10;
                    yPos3 = yPos * 10;
                    break;
                    
			    case 4:
                    xPos4 = xPos * 10;
                    yPos4 = yPos * 10;
                    break;
                    
                default:
                    console.log("whichPoint out of bounds: "+whichPoint);
                    break;
			}
			
			// If 1st or greater then draw point 1
			if (whichPoint>=1) {	
				// Draw a dot at position 1
				context.beginPath();
				context.arc(xPos1, yPos1, 30, 0, 10 * Math.PI, false);
				context.fillStyle = 'black';
				context.fill();
				context.lineWidth = 10;
				context.strokeStyle = '#fff';
				context.stroke();		
			}

			// If 2nd or greater then draw point 2
			if (whichPoint>=2) {	
				// Draw a dot at position 2
				context.beginPath();
				context.arc(xPos2, yPos2, 30, 0, 10 * Math.PI, false);
				context.fillStyle = 'black';
				context.fill();
				context.lineWidth = 10;
				context.strokeStyle = '#fff';
				context.stroke();		
			}

			// If 3rd or greater then draw point 3
			if (whichPoint>=3) {	
			    // Draw a dot at position 3
                context.beginPath();
                context.arc(xPos3, yPos3, 30, 0, 10 * Math.PI, false);
                context.fillStyle = 'black';
                context.fill();
                context.lineWidth = 10;
                context.strokeStyle = '#fff';
                context.stroke();
                
				// Draw the bezier curve between all 3 points for top of mouth
				context.beginPath();
				context.moveTo(xPos1,yPos1);
				context.quadraticCurveTo(xPos3,yPos3 + 150,xPos2,yPos2);
				context.stroke();		
				
				xPos4 = xPos2;
				yPos4 = canvas.height-1;
				
				xPos5 = xPos1;
				yPos5 = canvas.height-1;
				
				context.beginPath();
				context.moveTo(xPos4,yPos4);
				context.lineTo(xPos2,yPos2);
				context.stroke();
				
				context.beginPath();
				context.moveTo(xPos1,yPos1);
				context.lineTo(xPos5,yPos5);
				context.stroke();
				
				context.beginPath();
				context.moveTo(xPos4,yPos4);
				context.lineTo(xPos5,yPos5);
				context.stroke();
				
				//mark stage as complete
				complete[6]=1;
			}
			
	    }
		
		function resetJaw() {
			whichPoint=0;
			xPos1=0;
			yPos1=0;
			xPos2=0;
			yPos2=0;
			xPos3=0;
			yPos3=0;
			xPos4=0;
			yPos4=0;
			canvas.width = canvas.width;
		}
		
		function clipJaw() {
		    
		    /*
            var face = document.createElement("canvas");
            face.width = canvas.width;
            face.height = canvas.height;
            var faceCtx = face.getContext("2d");

		    /* Save the face without the jaw *
		    faceCtx.drawImage(backgroundimage,0,0);
		    faceCtx.beginPath();
		    faceCtx.moveTo(xPos1,yPos1);
		    faceCtx.quadraticCurveTo(xPos3,yPos3 + 150,xPos2,yPos2);
            faceCtx.lineTo(xPos4,yPos4);
            faceCtx.lineTo(xPos5,yPos5);
            faceCtx.lineTo(xPos1,yPos1);
            faceCtx.clip();
            overlayimage.src = face.toDataURL();

		    /* Save the jaw without the face *
		    face.width = face.width;
		    faceCtx.drawImage(backgroundimage,0,0);
		    faceCtx.beginPath();
            faceCtx.moveTo(xPos1,yPos1);
            faceCtx.quadraticCurveTo(xPos3,yPos3 + 150,xPos2,yPos2);
            faceCtx.lineTo(xPos4,yPos4);
            faceCtx.lineTo(face.width, face.height);
            faceCtx.lineTo(face.width, 0);
            faceCtx.lineTo(0, 0);
            faceCtx.lineTo(0, face.height);
            faceCtx.lineTo(xPos5,yPos5);
            faceCtx.lineTo(xPos1,yPos1);
            faceCtx.clip();
            jawimage.src = face.toDataURL();
            
		    /* Save a black shape of the jaw cutout *
		    face.width = face.width;
		    faceCtx.fillStyle = "black";
		    faceCtx.beginPath();
            faceCtx.moveTo(xPos1,yPos1);
            faceCtx.quadraticCurveTo(xPos3,yPos3 + 150,xPos2,yPos2);
            faceCtx.lineTo(xPos4,yPos4);
            faceCtx.lineTo(xPos5,yPos5);
            faceCtx.lineTo(xPos1,yPos1);
            faceCtx.fill();
            blackJawCutout = face.toDataURL();
            */

			canvas.width = canvas.width;
			context.drawImage(backgroundimage,0,0);
			
			context.beginPath();
			context.moveTo(xPos1,yPos1);
			context.quadraticCurveTo(xPos3,yPos3 + 150,xPos2,yPos2);
			context.lineTo(xPos4,yPos4);
			context.lineTo(xPos5,yPos5);
			context.lineTo(xPos1,yPos1);
			context.fillstyle = "#FF0000";
			context.fill();
			
			//RJE - Add outline of area user will need to cut out for mouth mechansim
			context.fillStyle="#FFFFFF";
			context.fillRect(xPos1+((xPos2-xPos1)/3),yPos1+((yPos4-yPos1)/2),(xPos2-xPos1)/3,(yPos4-yPos1)/2); 			
			
			canvasjaw.width = canvasjaw.width;
			context2.drawImage(backgroundimage,0,0);
			
			canvasoverlay.width = canvasoverlay.width;
			context3.drawImage(backgroundimage,0,0);
			
			context2.beginPath();
			context2.moveTo(xPos1,yPos1);
			context2.quadraticCurveTo(xPos3,yPos3 + 150,xPos2,yPos2);
			context2.lineTo(xPos4,yPos4);
			context2.lineTo(canvasjaw.width, canvasjaw.height);
			context2.lineTo(canvasjaw.width, 0);
			context2.lineTo(0, 0);
			context2.lineTo(0, canvasjaw.height);
			context2.lineTo(xPos5,yPos5);
			context2.lineTo(xPos1,yPos1);
			context2.clip();

			//get content
			completebg[6] = canvas.toDataURL();
			backgroundimage.src = completebg[6];
			jawimage.src = canvasjaw.toDataURL();
			//clear hidden canvas
			canvasjaw.width = canvasjaw.width;
			
			jawimage.onload = function() {
			  context2.drawImage(jawimage,0,0);
			};
			
			context2.beginPath();
		
			context2.moveTo(xPos1,yPos1);
			context2.quadraticCurveTo(xPos3,yPos3 + 150,xPos2,yPos2);
			context2.lineTo(xPos4,yPos4);
			context2.lineTo(xPos5,yPos5);
			context2.lineTo(xPos1,yPos1);
			context2.clip();
			
			//jawimage.src = canvasjaw.toDataURL();
			
			//create the overlay image that just contains the top half of face with transparnt mouth cut out
			context3.fillStyle = "white";
			context3.beginPath();

			context3.moveTo(xPos1,yPos1);
			context3.quadraticCurveTo(xPos3,yPos3 + 150,xPos2,yPos2);
			context3.lineTo(xPos4,yPos4);
			context3.lineTo(xPos5,yPos5);
            context3.lineTo(xPos1,yPos1);

			context3.fill();
			
			overlayimage.src = canvasoverlay.toDataURL();
			
			canvasoverlay.width = canvasoverlay.width;
			
			overlayimage.onload = function() {
			  context3.drawImage(overlayimage,0,0);
			};
			
					
			context3.beginPath();
		
			context3.moveTo(xPos1,yPos1);
			context3.quadraticCurveTo(xPos3,yPos3 + 150,xPos2,yPos2);
			context3.lineTo(xPos4,yPos4);
            context3.lineTo(canvasoverlay.width-1, canvasoverlay.height-1);
            context3.lineTo(canvasoverlay.width-1, 0);
            context3.lineTo(0, 0);
            context3.lineTo(0, canvasoverlay.height-1);
			context3.lineTo(xPos5,yPos5);
            context3.lineTo(xPos1,yPos1);
			context3.clip();
			
			overlayimage.src = canvasoverlay.toDataURL(); 
		}

		var j = 0;


		function animateJaw() {
			canvasjaw.style.display='block';
			j = 0;
			complete[8]=1;
    		doMove();
		}
	

		 function doMove() {

		     if (j < 2000) {   
		         if (canvasjaw.style.top=='90px') {
		             canvasjaw.style.top = '80px';
		             setTimeout(doMove,200); // call doMove in 20msec
		         } else {
		             canvasjaw.style.top = '90px';
		             setTimeout(doMove,200); // call doMove in 20msec
		         }
		     }
		     j++;
		 }

		// --------------------
		// ---- add images ----
		// --------------------


		function addEye() {			
			// set the item to add and move
			item = 'Eye';
						
			if (currentStage==4) {
				xOffset = (canvas.width / 3) - 100;
				yOffset = (canvas.height / 2) - 44;
			} else {
				xOffset = (2 * canvas.width / 3) - 100;
				yOffset = (canvas.height / 2) - 44;
			}
			
			xOffset=xOffset-80;//half the width of the eye image
			xStartPos=0;
			yStartPos=0;
			xPos=0;
			yPos=0;
			
			// add new listerners
			
			document.getElementById('canvas').addEventListener('mousedown', handleMouseDownNew);
			document.getElementById('canvas').addEventListener('mousemove', handleMouseMoveNew);
			document.getElementById('canvas').addEventListener('mouseup', handleMouseUpNew);

			//draw background			
			backgroundimage.onload = function(){
	            canvas.width = canvas.width;
				context.drawImage(backgroundimage,0,0);
				draw('Eye');
				backgroundimage.onload = null;
			};
			// collect the old canvas image data for background
            backgroundimage.src = completebg[currentStage - 1];
		}

		function resetTeeth() {
			
            backgroundimage.onload = function(){
                canvas.width = canvas.width;
                context.drawImage(backgroundimage,0,0); 
                backgroundimage.onload = null;
            };
            backgroundimage.src = completebg[currentStage - 1];
		}

		function addTeeth(n) {
			
		    showProcessing(function() {
			
				resetTeeth();
				
		        // set the item to add and move
	            item = 'Teeth'+n;
	            
	            xOffset=xPos4+((xPos5-xPos4)/2);
	            xOffset=xOffset-400; //half width of teeth image
	            yOffset=yPos1;
	            
	            // add new listerners
	            document.getElementById('canvas').addEventListener('mousedown', handleMouseDownNew);
	            document.getElementById('canvas').addEventListener('mousemove', handleMouseMoveNew);
	            document.getElementById('canvas').addEventListener('mouseup', handleMouseUpNew);

				draw(item);
		    });
		}


		function draw(item){
			
			var path;
			var width;
			var height;
			
			canvas.width = canvas.width;			
            context.drawImage(backgroundimage,0,0);

			// RJE - If drawing teeth then only draw them within the mouth area
			if (item!="Eye") {
				// Add a mask to main context as that's where the teeth are
				// We don't use the bezier curve but a straight line between 1st 2 points as much better in practice
				context.beginPath();		
				context.moveTo(xPos1,yPos1);
				context.lineTo(xPos2,yPos2);
				context.lineTo(xPos4,yPos4);
				context.lineTo(xPos5,yPos5);
				context.lineTo(xPos1,yPos1);
				context.clip();
			}
			// RJE - End
			
			if(item == "Eye") {
	            
				//pick your eyes so to speak
			    path = "img/eye-big-white.png";
			    path = "img/eye-big.png";
				path = "img/eye-big50.png";
				path = "img/eye-big-white-outline.png";
			    //context.drawImage(backgroundimage,0,0);
			} else {
			    path = "img/teeth0"+item.substr(5)+"-big.png";
			}
			
			if(img.src.indexOf(path) == -1) {
			    img.src = path;
                img.onload = function(){

                    width = img.naturalWidth;
                    height = img.naturalHeight;
                    
                    if(twoPages) {
                        width = width * (255 / 330);
                        height = height * (255 / 330);
                    }
                    
                    context.drawImage(img,xOffset,yOffset,width,height);
                };
			} else {
			    width = img.naturalWidth;
                height = img.naturalHeight;
                
                if(twoPages) {
                    width = width * (255 / 330);
                    height = height * (255 / 330);
                }
                
                context.drawImage(img,xOffset,yOffset,width,height);
			}
		}

		function handleMouseDownNew(e){
			xStartPos=parseInt(e.pageX);
			yStartPos=parseInt(e.pageY);
			isDragging=true;
		}

		function handleMouseUpNew(e){
			isDragging=false;
			draw(item);
		}

		function handleMouseMoveNew(e){
			xStartPos=xPos;
			yStartPos=yPos;
			xPos=parseInt(e.pageX*speed);
			yPos=parseInt(e.pageY*speed);

			// if the drag flag is set, clear the canvas and draw the image
			if(isDragging){
				xOffset=xOffset-(xStartPos-xPos);
				yOffset=yOffset-(yStartPos-yPos);
				// Redraw canvas
				draw(item);
			}
		}


		// Load a video in to the central frame
		function loadVideo() {
			var html = '<iframe title="YouTube video player" class="youtube-player" type="text/html" width="600" height="375" src="'+videourl+'" frameborder="0" style="padding:40px;" allowFullScreen></iframe>';
			document.getElementById("stage3EditorFrame").innerHTML = html;
		}

		// Save image option
		function saveImage() {
			
			if(istemplate==1) {
				window.location.href=imgTemplateURL; // it will save locally
			} else {
			        var image = document.getElementById("canvassave").toDataURL("image/png", 0.6);
			        image = image.substr(image.indexOf(',') + 1).toString();

			        var input = document.createElement("input") ;
			        input.setAttribute("name", 'image') ;
			        input.setAttribute("value", image);
			        input.setAttribute("type", "hidden");

			        var form = document.createElement("form");
			        form.method = 'post';
			        form.action = 'services/save.php';
			        form.appendChild(input);

			        document.body.appendChild(form);
			        form.submit();
			        document.body.removeChild(form);
			}
		}

		function printCanvas(){
			var maskheight='1650px';
			var jawheight='1800px';
			var templateheight='3450px';
			
			if(twoPages) {
			    maskheight='2135px';
			    jawheight='2330px';
			}
			
			var win = window.open();
			if (istemplate==1) {
				win.document.open();
				win.document.write("<html><body><br><img src='"+imgTemplateURL+"'  height='"+templateheight+"' /><br></body></html>");
				win.document.close();
			} else {
				var tempMaskPrintable = canvas.toDataURL();
				var tempJawPrintable = canvasjaw.toDataURL();
				//win.document.write("test0<br><img src='"+tempMaskPrintable+"' height='"+maskheight+"' /><br>test1<img src='"+tempJawPrintable+"' height='"+jawheight+"'/>test2");
			}
			win.document.write("<p>Test</p>");
			win.focus();
			//win.print();
			//win.location.reload();
		}


var istemplate=0;
var imgTemplateURL ="";
var imgTemplatePreview = "";

$(function() {
   
    $(".maskTemplate").click(function(e) {
        
		istemplate=1;
        //var imgURL = "";
        
        switch($(this).children("img").first().attr("id")) {
            case "templateTiger":
               imgTemplateURL = "img/tiger-mask.jpg";
			   imgTemplatePreview = "img/chosen-template-tiger.png";
                break;
            case "templatePanda":
                imgTemplateURL = "img/panda-mask.jpg";
				imgTemplatePreview = "img/chosen-template-panda.png";
				break;
                
            case "templateMonkey":
                imgTemplateURL = "img/monkey-mask.jpg";
				imgTemplatePreview = "img/chosen-template-monkey.png";
                break;
                
            default:
                return;
                break;
		}
        document.getElementById("printImg").src = imgTemplateURL;
		document.getElementById("stage1InstructionsFrame").style.display="none";
		document.getElementById("stage1EditorFrame").style.display="none";
        showStage(9);
        
    });
    
});