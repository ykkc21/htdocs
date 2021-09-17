$(() => {

    const data = "/json/data.json",
        locations = "/json/location.json",
        menus = "/json/menus.json",
        basket = "/json/basket.json";


    // 지도

    const Map = {
        move: false,
        LV: 0,
        size: 100,
        num: 1,
        data: [],
        location: [],
        init: function () {
            const obj = this;
            $.getJSON(locations, function (data) {
                obj.location = data;
            });
            $.getJSON(data, (data) => {
                obj.data = data;
            });
        },
        MapDraw: function () {
            $(".img").css({ "width": "100%", "height": "100%", "background-image": "url('/map.jpg')", "background-size": "100% 100%" });
        },
        AncestryPsition: function (num = 1) {
            const locationData = this.location,
                breadName = this.data,
                MapW = $(".Map")[0].clientWidth * 1,
                MapH = $(".Map")[0].clientHeight * 1;

            breadName.forEach(items => {
                locationData.forEach(item => {
                    const num1 = (item.X / MapW) * 100,
                        num2 = (item.Y / MapH) * 100;

                    if (items.name == item.name) {
                        const div = `<div data_name= "${items.name}" data_location="${items.location}" data_time="${items.time}" data_etc="${items.etc}" class="Icon PositionIcon" style=' width:40px; height: 60px; position: absolute; background-image: url("/Icon.png"); background-size: 100% 100%; top:${num1}%; left:${num2}%; '></div>`;
                        $(".img").append(div);
                    }
                })
            })

            $(".Icon").click(function (e) {
                e.preventDefault();
                const location = $(this).attr("data_location"),
                    time = $(this).attr("data_time"),
                    etc = $(this).attr('data_etc'),
                    name = $(this).attr('data_name');

                $(".Icon").removeClass("show");
                $(this).addClass("show");

                $('.time').text(time);
                $('.location').text(location);
                $('.etc').text(etc);

                $('.sub_text').dialog({
                    title: `빵집소개:${name}`
                });

            });
        },
        enlargement: function (size) {
            if (size > 200) {
                alert("더 이상은 확대가 안됩니다.");
                Map.size = 200;
                size = Map.size;
                $('.img').css({ "width": `${size}%`, "height": `${size}% ,position": "absolute", "top": "50%", "left": "50%", "transform": "translate(-50%,-50%)` });
                Map.num = 2;
                Map.LV = 10;
                $(".level").text(`${Map.LV}LV`);
            } else {
                $(".img").animate({ "width": `${size}%`, "height": `${size}%` });
                $('.img').css({ "position": "absolute", "top": "50%", "left": "50%", "transform": "translate(-50%,-50%)" });
            }
        },
        reduction: function (size) {
            if (Map.size < 100) {
                alert("더 이상 줄어들지 않습니다.");
                Map.size = 100;
                size = Map.size;
                $(".img").css({ "width": `${size}%`, "height": `${size}%`, "position": "absolute", "top": "50%", "left": "50%", "transform": "translate(-50%,-50%)" });
                Map.num = 1;
                Map.LV = 1;
                $(".level").text(`${Map.LV}LV`);
            } else {
                $(".img").animate({ "width": `${size}%`, "height": `${size}%` });
                $(".img").css({ "position": "absolute", "top": "50%", "left": "50%", "transform": "translate(-50%,-50%)" });
            }
        },
        MapMove: function (x, y) {

        },
    };


    $(".open_Map").click(() => {
        let map = $(".Map");
        $(map).dialog({
            title: "빵 지도",
            width: "900",
            height: "650"
        });
        $(".Map > div > ul > li > button").css({ "display": "block" });
        $(".Map > .img_box").css({ "display": "block" });

        Map.MapDraw();
        Map.AncestryPsition();
    });

    $('.plus').click((e) => {
        $(".img").html("");
        Map.size += 10;
        Map.num += 0.1;
        Map.LV += 1;
        $(".level").text(`${Map.LV}LV`);
        if (Map.LV == 10) {
            $(".level").text(`${Map.LV}LV`);
        }
        Map.enlargement(Map.size);
        Map.AncestryPsition(Map.num);
    });

    $('.minus').click((e) => {
        $(".img").html("");
        Map.size -= 10;
        Map.num -= 0.1;
        Map.LV -= 1;
        $(".level").text(`${Map.LV}LV`);
        if (Map.LV == 2) {
            $(".level").text(`1LV`);
        }
        Map.reduction(Map.size);
        Map.AncestryPsition(Map.num);
    });

    $('.move').click(() => {

        const MapTop = $(".img").offset().top,
            MapLeft = $('.img').offset().left,
            BoxTop = $('.Map').offset().top,
            BoxLeft = $(".Map").offset().left;

        $('.img_box').draggable({
            revert: function () {

            },
        });


    });

    // 빵리스트 

    const list_menu = {
        id: 1,
        num: 1,
        keep:[],
        data: [],
        menus: [],
        init: function () {
            const obj = this;
            $.getJSON(data, (data) => {
                obj.data.push(data);
                obj.DrawBreadHomeList(data);
            });
            $.getJSON(menus, (data) => {
                data = data.map((data, idx) => {
                    return { ...data, id:list_menu.id++, count : 1 };
                });
                data.forEach(item => {
                    list_menu.menus.push(item);  
                })
                obj.DrawBreadList(data);
                obj.KeepItemDraw();
            });
        },
        DrawBreadHomeList: function (data) {
            data.forEach(item => {
                const box = `<div class="breadHome_list_box" data_name="${item.name}" data_time="${item.time}" data_location="${item.location}" data_etc="${item.etc}" data_sale="${item.sale}" >
                <img src="/빵집/${item.name}/${item.images[0].img1}" >
                <h1 class="breadHome" style="float:left;">${item.name}</h1>
                <button class="info_breadHome">빵집보기</button>
                <button class="info_bread">상품보기</button>
                </div>`;
                $('.list_box').append(box);
            });

            //빵집보기 버튼
            $(".info_breadHome").click((e) => {
                const TargetBox = $(e.target).parents(".breadHome_list_box");
                const name = $(TargetBox).attr('data_name');
                const time = $(TargetBox).attr('data_time');
                const location = $(TargetBox).attr('data_location');
                const sale = $(TargetBox).attr('data_sale');
                const etc = $(TargetBox).attr('data_etc');

                $(".info_image").html("");

                data.forEach(item => {
                    item.images.forEach(img => {
                        if (item.name == name) {
                            for (let i = 1; i <= 6; i++) {
                                const image = `<div class="imageBox" id="image_box${i}"><img src="/빵집/${item.name}/${i}.jpg"></div>`;
                                $('.info_image').append(image);
                            }
                        }
                    })
                });

                $(".breadHome_info").dialog({
                    title: "빵집정보",
                    width: "500",
                    height: "450",
                    show: {
                        effect: "blind",
                        duration: 1000
                    },
                    hide: {
                        effect: "explode",
                        duration: 1000
                    }
                });

                $(".info_name").text(name);
                $(".info_time").text(time);
                $(".info_location").text(location);
                $(".info_etc").text(etc);
                $(".info_sale").text(sale);

            });

            //상품보기 버튼
            $('.info_bread').click((e) => {
                      const TargetBox = $(e.target).parents(".breadHome_list_box");
                const name = $(TargetBox).attr('data_name');

                $('.bread_info').html("");

                this.menus.forEach(item => {
                    item.forEach(data => {
                        if (data.name == name) {
                                               const image = `<div class="checkBread">
                            <img class="image" src="/breadmenu/${data.image}">
                            <div>메뉴이름:${data.menuname}</div>
                            <div>설명:${data.etc}</div>
                            <div>가격:${data.price}</div>
                            <div>보관방법:${data.keep}</div>
                            <div>open:${data.time}</div>
                            </div>`;
                            $('.bread_info').append(image);
                        }
                    })
                });


                $('.bread_info').dialog({
                    title: "모든 빵",
                    width: "600",
                    height: '500',
                    show: {
                        effect: "blind",
                        duration: 1000
                    },
                    hide: {
                        effect: "explode",
                        duration: 1000
                    }
                });
            });

        },
        DrawBreadList: function (data) {

            data.forEach(item => {
                const box = `<div item_Id="${item.id}" class="bread_list_box">
                <img src="/breadmenu/${item.image}" >
                <h1 class="breadName" style="float:left; font-size:30px">${item.menuname}</h1>
                <p>가격:${item.price}</p>
                </div>`;
                $('.menu_list_box').append(box);
            });

            $(".bread_list_box").draggable({
                revert: true,
            });

            $(".bread_list_box").click((e) => {
                const TargetBox = $(e.target);
                if(window.event.shiftKey) {
                    $(TargetBox).addClass("show");
                }else {
                    $('.bread_list_box').removeClass("show");
                }
            });

            $('.wishBox').droppable({
                drop: function(e,i) {
                    const Draggable = i.draggable[0],
                    ItemId = $(Draggable).attr('item_id'),
                    SeletItem = list_menu.SeletItem(ItemId),
                    obj = list_menu.ItemOverlap(ItemId);

                    list_menu.keep.push(SeletItem);

                    if(obj) {
                        alert("중복");
                        obj.count ++;
                    }
                }
            });

        },
        SeletItem:function(id) {
            const idx = list_menu.menus.find((e,i) => { return e.id == id  });
            return idx;
        },
        ItemOverlap:function(id) {

            const idx = list_menu.keep.find((e,i) => {  return e.id == id });
            return idx;
        },
        KeepItemDraw:function () {
            const set = new Set(list_menu.keep);
            const item = [...set];
            console.log(item);
        }

    };


    $('.All_menu').click(() => {
        list_menu.menus.forEach(item => {
            item.forEach(data => {
                const image = `<div class="s_box">
                <img class="image" src="/breadmenu/${data.image}">
                <div>메뉴이름:${data.menuname}</div>
                <div>설명:${data.etc}</div>
                <div>가격:${data.price}</div>
                <div>보관방법:${data.keep}</div>
                <div>open:${data.time}</div>
                </div>`;
                $('.All_menu_box').append(image);
            })
        });

        $('.All_menu_box').dialog({
            title: "모든메뉴",
            width: 950,
            height: 600
        });
    });


    // 키패트

    const keypad = {
        newText: "",
        valueL: [],
        init: function () {
            let char = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'Backspace', 'Reset'];
            let random = char.sort(() => Math.random() - 0.5);

            $('.keypad').append(`<input type="text" class="keyValue">`);
            random.forEach(item => {
                const btn = ` <button class="numPad" data="${item}">${item}</button>`;
                $('.keypad').append(btn);
            });

            $(".numPad").click((e) => {
                let obj = e.target;
                let num = $(obj).attr("data") * 1;
                let data = $(obj).attr("data");

                       $('.keyValue').val(this.newText);

                if (data == 'Reset') {
                    $('.keypad').html("");
                    keypad.init();
                    this.newText = "";
                    $('.keyValue').val("");
                }

                if (data == 'Backspace') {
                    alert('뒤로가기');
                }
            });
        }
    };


    $('.keypad_start').click(() => {
        $('.keypad').dialog({
            title: "가상패드",
            width: "300px",
            heigth: "100px"
        })
    });


    keypad.init();
    Map.init();
    list_menu.init();


});