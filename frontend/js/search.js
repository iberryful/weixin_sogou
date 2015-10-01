// Functions

function search(query){
  var localQueryUrl = "http://weirss.me/search/local/"+query+"/";
  var sogouQueryUrl = "http://weirss.me/search/weixin/"+query+"/";
  var localTemplate = "<li class='item' data-accountid='__account_id__'><span class='access_time'>__access_times__</span><a class='name' href='__address__' target='something'>__name__</a><span class='desc'>__description__</span></li>";
  var sogouTemplate = "<li class='item' data-openid='__openid__' data-accountid='__account_id__'><span class='add_time'>添加</span><a class='name' href='__address__' target='something'>__name__</a><span class='desc'>__description__</span></li>";
  var hadlist = []
  var queryData = {"queryUrl":localQueryUrl,"template":localTemplate}
  $('div.loading').show();
  getSearch(queryData,function(data){
    if(data.length){
      $('div.searchresults').show();
      $('div.loading').hide();
      $('div.alreadyhave').show();
      $('div.fromsogou').hide();
      $('div.wrap').show();
      showResult(localTemplate,data,[],function(msg,hlist){
        if(msg>5){
          $('div.alreadyhave .showmore').show();
        }
        hadlist = hlist;
        queryData = {"queryUrl":sogouQueryUrl,"template":sogouTemplate,"flag":"noalert"}
        getSearch(queryData,function(data){
          if(data.length){
            showResult(sogouTemplate,data,hadlist,function(msg,l){
              if(l.length){
                $('div.fromsogou').show();
              }
              if(l.length>5){
                $('div.fromsogou .showmore').show();
              }
            })
            $('ul.fromsogou span.add_time').off('click').on('click',function(e){
              e.preventDefault();
              e.stopPropagation();
              var openid = $(this).closest('li').attr("data-openid");
              sendAddPost(openid);
            })
          }
        })
      })
    }else{
      $('div.alreadyhave').hide();
      queryData = {"queryUrl":sogouQueryUrl,"template":sogouTemplate}
      getSearch(queryData,function(data){
        if(data.length){
          $('div.searchresults').show();
          $('div.fromsogou').show();
          $('div.loading').hide();
          $('div.wrap').show();
          showResult(sogouTemplate,data,hadlist,function(msg,l){
            if(msg>5){
              $('div.fromsogou .showmore').show();
            }
          })
          $('ul.fromsogou span.add_time').off('click').on('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            var openid = $(this).closest('li').attr("data-openid");
            sendAddPost(openid);
          })
        }else{
          showAlert('alert',"检索无结果, 请更换搜索词 ^_^");
          $('div.close').trigger("click");
        }
      })
    }
  })
}


function getSearch(queryData,callback){
  $.ajax({
    method: "GET",
    url: queryData.queryUrl,
    dataType: 'json',
    timeout: 1000*10
  })
  .done(function(data){
    callback(data);
  })
  .fail(function(data){
    if(queryData.flag && queryData.flag == "noalert") return
    showAlert('fail',"检索失败, 请<a href='javascript:;' onclick='searchAgain();'>点此重试</a>",20000)
    $('div.close').trigger("click");
  })
}

function searchAgain(){
  $('input#gosearch').trigger('click');
}

function showResult(template,data,compareList,callback){
  var accountlist = [];
  $.each(data,function(key,value){
    if(value.access_times>=0){
      var cItem = template.replace("__account_id__",value.account_id).replace("__access_times__",value.access_times).replace("__address__","http://weirss.me/account/"+value.account_id).replace("__name__",value.name).replace("__description__",value.description);
      $('ul.alreadyhave').append(cItem);
      accountlist.push(value.account_id);
    }else{
      if(compareList.indexOf(value.account)==-1){
        var cItem = template.replace("__account_id__",value.account).replace("__address__",value.address).replace("__name__",value.name).replace("__description__",value.description).replace('__openid__',value.open_id);
        $('ul.fromsogou').append(cItem);
        accountlist.push(value.account);
      }
    }
    if(key == data.length - 1){
      callback(data.length,accountlist);
    }
  })
}


function showAlert(status,msg,duration){
  if(!duration) duration = 5000;
  $('div.notification').stop().fadeIn().removeClass('fail success alert').addClass(status).html(msg).show().fadeOut(duration);
}


function sendUpdatePost(postinfo,callback){

}

function sendAddPost(openid){
 $.ajax({
    method: "GET",
    url: "http://weirss.me/add/"+openid+"/",
    dataType: 'json',
    timeout: 1000*10
  })
  .done(function(data){
    if(data.msg == "ok"){
      showAlert('success',"添加成功, <a href='http://weirss.me/account/"+data.account_id+"' target=something >点击查看</a>",20000)
    }else if(data.msg == "repeat"){
      showAlert('alert',"已添加, <a href='http://weirss.me/account/"+data.account_id+"' target=something >点击查看</a>",20000)
    }else{
      showAlert('fail',"添加失败, 请<a href='javascript:;' onclick='sendAddPost(\""+openid+"\")' >点此重试</a>",20000)
    }
  })
  .fail(function(data){
    showAlert('fail',"添加失败, 请<a href='javascript:;' onclick='sendAddPost(\""+openid+"\")' >点此重试</a>",20000)
  })
}


$(document).ready(function(){

  $('button.showmore').on('click',function(e){
    e.preventDefault();
    var childs = $(this).prev('ul').find('li');
    var childCount = childs.length;
    // Show all the rest of childs or part of them ?
    childs.filter(':eq('+5+'), :gt('+5+')').show();
    $(this).hide();
  })

  $('form.search').submit(function(e){
    e.preventDefault();
  })

  $('div.close').on('click',function(){
    $('div.searchresults').hide();
    $('ul.alreadyhave').empty();
    $('ul.fromsogou').empty();
    $('div.loading,div.wrap,div.alreadyhave,div.fromsogou,.showmore').hide();
  })

  $('input#gosearch').on('click',function(e){
    var query = $('input#searchbox').val();
    search(query);
  })

  $('input#addbyid').on('click',function(e){
    var openid = $('input#searchbox').val();
    sendAddPost(openid);
  })

  $('div.notification').hover(
    function(){
      $(this).stop().fadeIn();
    },function(){
      $(this).stop().fadeOut(5000);
    }
  )

  $('a#donatelink').hover(
    function(){
      $('div#zhifubao').stop().slideDown();
    },function(){
      $('div#zhifubao').stop().slideUp();
    }
  )
  $('a#donatelink').on('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    $('form#paytip').submit();
  })

})
