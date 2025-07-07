// equal height
!function n(t,r,e){function i(u,f){if(!r[u]){if(!t[u]){var c="function"==typeof require&&require;if(!f&&c)return c(u,!0);if(o)return o(u,!0);throw new Error("Cannot find module '"+u+"'")}var a=r[u]={exports:{}};t[u][0].call(a.exports,function(n){var r=t[u][1][n];return i(r||n)},a,a.exports,n,t,r,e)}return r[u].exports}for(var o="function"==typeof require&&require,u=0;u<e.length;u++)i(e[u]);return i}({1:[function(n,t,r){!function(n){function t(){var t,r=n("[data-eq]").map(function(){return n(this).data("eq")}).get();(t={},r.forEach(function(n){t[n+"::"+typeof n]=n}),Object.keys(t).map(function(n){return t[n]})).forEach(function(t){var r=0;n('[data-eq="'+t+'"]').css("min-height","").each(function(){n(this).outerHeight()>r&&(r=n(this).outerHeight())}).css("min-height",r+"px")})}n(window).on("load",function(){t()}),n(window).resize(function(){t()})}(jQuery)},{}]},{},[1]);

//Loader
$(window).load(function(){
  setTimeout(function(){
      $('#preloader').velocity({
          opacity : 0.1,
          translateY: "-80px"
      }, {
          duration: 400,
          complete: function(){
          $('#hola').velocity({
          translateY : "-100%"
      })  
          }
      })
  },1000)
})

// Scroll to Top
$(".totop").click(function() {
$("html, body").animate({ scrollTop: 0 }, "slow");
return false;
});
$(window).scroll(function() {
if ($(this).scrollTop()) {
  $('.totop:hidden').stop(true, true).fadeIn();
} else {
  $('.totop').stop(true, true).fadeOut();
}
});

//Fixed Header
$(window).scroll(function () {
  var scroll = $(window).scrollTop();
  if (scroll >= 1) {
      $("header").addClass("fixed_header");
  } else {
      $("header").removeClass("fixed_header");
  }
});
		
//Lazy Loading
 if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.src;
    });
  } else {
    // Dynamically import the LazySizes library
    const script = document.createElement('script');
    script.src =
      'js/lazysizes.min.js';
    document.body.appendChild(script);
  }


//Rev Slider
$(".rev-slider").slick({
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  speed: 2000,
  pauseOnHover:false,
  fade:true
});

//Rev Slider
$(".partner-slider").slick({
  infinite: true,
  slidesToShow: 6,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  speed: 1000,
  pauseOnHover:false,
  fade:false,
  responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
});

// Tooltip
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});

//
$(".navbar-toggler").click(function(){
  $(".header").toggleClass("showHeader");
});



$('.product-img-slide').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  dots: false,
  asNavFor: '.img-selectSlide'
  });
  $('.img-selectSlide').slick({
  vertical: true,
  verticalSwiping: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  asNavFor: '.product-img-slide',
  arrows: false,
  dots: false,
  focusOnSelect: true,
  responsive: [
  {
    breakpoint: 768,
    settings: {
      slidesToShow: 4,
      vertical: false,
      verticalSwiping: false,
    }
  }
]
  });

  $('.most-likeSlider').slick({
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  responsive: [
  {
    breakpoint: 769,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 1,
    }
  },
  {
    breakpoint: 575,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
    }
  }
]
  });


  /*-------------Quantity-------------*/
var buttonPlus  = $(".qty-btn-plus");
var buttonMinus = $(".qty-btn-minus");

var incrementPlus = buttonPlus.click(function() {
var $n = $(this)
.parent(".qty-container")
.find(".input-qty");
$n.val(Number($n.val())+1 );
});

var incrementMinus = buttonMinus.click(function() {
var $n = $(this)
.parent(".qty-container")
.find(".input-qty");
var amount = Number($n.val());
if (amount > 0) {
    $n.val(amount-1);
}
});

$('.our-slider').slick({
  dots: false,
  infinite: true,
  speed: 500,
  fade: true,
  cssEase: 'linear'
  });

//
$(function(){  
  $('#eye').click(function(){       
        if($(this).hasClass('fa fa-eye-slash')){           
          $(this).removeClass('fa fa-eye-slash');          
          $(this).addClass('fa fa-eye');          
          $('#password').attr('type','text');            
        }else{         
          $(this).removeClass('fa fa-eye');          
          $(this).addClass('fa fa-eye-slash');            
          $('#password').attr('type','password');
        }
    });

  $('#eye_1').click(function(){       
        if($(this).hasClass('fa fa-eye-slash')){           
          $(this).removeClass('fa fa-eye-slash');          
          $(this).addClass('fa fa-eye');          
          $('#password_1').attr('type','text');            
        }else{         
          $(this).removeClass('fa fa-eye');          
          $(this).addClass('fa fa-eye-slash');            
          $('#password_1').attr('type','password');
        }
    });

    $('#eye_2').click(function(){       
        if($(this).hasClass('fa fa-eye-slash')){           
          $(this).removeClass('fa fa-eye-slash');          
          $(this).addClass('fa fa-eye');          
          $('#password_2').attr('type','text');            
        }else{         
          $(this).removeClass('fa fa-eye');          
          $(this).addClass('fa fa-eye-slash');            
          $('#password_2').attr('type','password');
        }
    });

});

// $('#categories').click(function(){
//   $('.filterBx').toggleClass('menushow');
// });