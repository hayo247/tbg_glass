
Coloris({        
    parent: '.clolorBox',
    theme: 'default',     //default, large, polaroid, pill        
    themeMode: 'light',   //light , dark 모드        
    margin: 0,            //입력 필드와 색선택시 사이 여백        
    alpha: false,          //불투명도 조절        
    format: 'hex',        //포맷  hex rgb hsl auto mixed        
    formatToggle: false,   //포맷 토글        
    clearButton: false,
    inline: false,        
    selectInput: true,
    wrap: true,
    onChange: onColorChange   
});

window.onload = function(){
    $("#market_name").val(getParameter("to"));
    $("#color-Ris").trigger("click");

    $("#btnCart").click(function() {
        addCart();
    });
    
    $(".board .board_color").click(function() {
        $("[name='colorChoice'][value='" + $(this).attr("value") + "']").prop('checked', true);
    });

    $("[name='colorChoice']").change(function() {
        var lr = $(this).val();
        var rgb = $("#" + lr + "Board").css('backgroundColor').split(",");
        var chRgb = "#" + chgRgbNum(rgb[0]) + "" + chgRgbNum(rgb[1]) + "" + chgRgbNum(rgb[2]);

        $("#color-Ris").val(chRgb);
        $("#color-Ris").trigger("click");   
    });
    
    $("#all_delete_cart").on('click', function(){
        $("#colorList").html("");
    })
    
    $("#select_delete_cart").on('click', function(){
        $("#colorList tr").each(function(idx, el){
            if($(el).find('.chk input').prop('checked')){
                $(this).remove()
            }
        })
    })

    //토글 ul
    $(".drop-down .selected a").click(function() {
        //$(".drop-down .options ul").toggle();
        var $options = $(this).parent().siblings('.options');
        $options.find('> ul').toggle();

        $(".clolorBox").css('z-index', -1);
    });

    //옵션 선택 및 선택 후 옵션 숨기기
    $(".drop-down .options ul li a").click(function() {
        var text = $(this).html();
        //$(".drop-down .selected a span").html(text);
        //$(".drop-down .options ul").hide();
        
        var $selected = $(this).closest('.options').siblings('.selected');
        $selected.find('> a > span').html(text);
        var co1= $(this).find('div').eq(0).attr('value'); 
        var co2= $(this).find('div').eq(1).attr('value'); 
        var lr =  $("[name='colorChoice']:checked").val();
        
        $("#leftBoard").css('background', "#" + co1);
        $("#rightBoard").css('background', "#" + co2);

        if("left" == lr){
            $("#color-Ris").val("#" + co1);
        }else{
            $("#color-Ris").val("#" + co2);
        }
        
        $("#color-Ris").trigger("click");   

        $(this).closest('ul').hide();
        $(".clolorBox").css('z-index', 1);
    }); 


    //페이지의 다른 위치를 클릭하면 옵션 숨기기
    $(document).bind('click', function(e) {
        var $clicked = $(e.target);
        if (!$clicked.parents().hasClass("drop-down")){
            $(".drop-down .options ul").hide();
            $(".clolorBox").css('z-index', 1);
        }else{                    
            $(".clolorBox").css('z-index', -1);
        }
    });
    
    $("#sendMail").on('click', function(){
        vaild();
    });

    $("#psnlAdd").on('click', function(){
        fn_layerPop($("#psnlPopup"));
    });
}

function chgRgbNum(val){
    return parseInt(val.replace(/[^0-9]/g, '')).toString(16).padStart(2, "0");
}

function valcd(val, n){
    return ((parseInt(val, 16) + n).toString(n)).padStart(2, "0");
}

function onColorChange(color){
    var lr = $("[name='colorChoice']:checked").val();

    $("#" + lr + "Board").css('background', color);
}

function addCart(){
    var html = "";
    
    var rgblf = $("#leftBoard").css('backgroundColor').split(",");
    var lfRgb = chgRgbNum(rgblf[0]) + "" + chgRgbNum(rgblf[1]) + "" + chgRgbNum(rgblf[2]);

    var rgbrg = $("#rightBoard").css('backgroundColor').split(",");
    var rgrgb = chgRgbNum(rgbrg[0]) + "" + chgRgbNum(rgbrg[1]) + "" + chgRgbNum(rgbrg[2]);

    var lfCode = getCode(lfRgb);
    var rgCode = getCode(rgrgb);

    html = "<tr>";
    html += '	<input type="hidden" name="색상1" value="' + lfRgb +'">';        
    html += '	<input type="hidden" name="색상2" value="' + rgrgb +'">';        
    html += '	<input type="hidden" name="코드1" value="' + lfCode +'">';          
    html += '	<input type="hidden" name="코드2" value="' + rgCode +'">';          
    html += "<td class='chk'><input type='checkbox'></td>";
    html += "<td class='val'><span style='background:#" +  lfRgb + "'>&emsp;&emsp;</span><span style='background:#" +  rgrgb + "'>&emsp;&emsp;</span> " + lfCode + " X "+rgCode+"</td>";
    html += "</tr>";

    $("#colorList").append(html);

    var el = document.getElementById('colorList');
    el.scrollTop = el.scrollHeight;
}

function getCode(color){
    var code = ("TB_C" + valcd(color.substr(1,2), 18) + valcd(color.substr(3,2), 24)+ valcd(color.substr(5,2), 32) ).toUpperCase()
    return code;
}

function vaild(){
    if($('#colorList tr').length <= 0){
        fn_layerPop($("#alertPopup"), "장바구니에 제품이 없습니다.");
        return;
    }
    
    if($('#order_name').val() == ""){
        fn_layerPop($("#alertPopup"), "주문자의 성함을 적어주세요.");
        return;
    }
    
    if($('#order_tel').val() == ""){
        fn_layerPop($("#alertPopup"), "주문자의 연락처를 적어주세요.");
        return;
    }
    
    if(!$("#chkAgree").prop('checked')){
        fn_layerPop($("#alertPopup"), "개인정보 취급방침을 동의합니다.");
        return;
    }

    save_img()
}

function save_img(){

    var html = "";

    $('#colorList tr').each(function(index){
        html += '<tr style=" border-bottom: 2px solid #BDBDBD; height: 60px;">';
        html += '	<td style="border-right: 1px solid #BDBDBD; display:flex;">';
        html += '	    <div  style="width:50%; height:60px; background:#' + $(this).find('input[name="색상1"]').val() +'">&nbsp;</div>';
        html += '	    <div  style="width:50%; height:60px; background:#' + $(this).find('input[name="색상2"]').val() +'">&nbsp;</div>';
        html += '	</td>';
        html += '	<td style="border-right: 1px solid #BDBDBD;">' + $(this).find('input[name="코드1"]').val() + ' X ' + $(this).find('input[name="코드2"]').val() +'</td>';
        html += '</tr>';
    });

    $('#saveImgForm ._cartList').html(html);

    var dt = new Date();
    var fileNm = "디자인칠판샘플견적서";
    
    fileNm = fileNm + dt.toLocaleDateString().replace(/\./gi, '').replace(/\ /gi, '');
    fileNm = fileNm + dt.toTimeString().split(' ')[0].replace(/\:/g, '');

    $("._name").html($('#order_name').val());
    $("._tel").html($('#order_tel').val());
    $("._market").html($('#market_name').val());

    fn_downloadImg('saveImgForm', fileNm);

    send_email();
}

// 이메일 보내기
function send_email(){	
    $('#price_total').val($('#totPrice').text());
    
    var cartTxt = "";
    
    $('#colorList tr').each(function(index){
        if(index != 0){
            cartTxt += "/"
        }
        cartTxt += $(this).find('input[name="색상1"]').val() + "|";
        cartTxt += $(this).find('input[name="색상2"]').val() + "|";
        cartTxt += $(this).find('input[name="코드1"]').val() + "|" 
        cartTxt += $(this).find('input[name="코드2"]').val()
    });
    
    $('#cart').val(cartTxt);

    var queryString = $("form[name=emailfrm]").serialize() ;

    $("#loadingPopup").show();
    $.ajax({
        data : queryString,
        type : 'post',
        url : 'https://script.google.com/macros/s/AKfycbxFnLiJBUO7iSApHqpWEGTvGTMaoZCyd_o4JnrHUViJ2kmz5-375HAbbwXh0rDhFJEH/exec',
        dataType : 'json',
        error: function(xhr, status, error){
            fn_layerPop($("#layer_alert"), error);
        },
        success : function(result){
            $("#loadingPopup").hide();
            if(result.result == "error"){
                fn_layerPop($("#alertPopup"), result.error.message);		
            }else{
                fn_callBackSendEmail();
            }
        }
    });
}


function fn_callBackSendEmail(){
$("._payOpt").text($("#tot_count").text());
fn_layerPop($("#payPopup"));
}
