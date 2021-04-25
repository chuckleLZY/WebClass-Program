
//Create a Cube
function Cube(a, b) {
    //初始化
    this.id = a;
    this.container = document.getElementById(a);    //容器
    this.opts = b || {};
    this.order = this.opts.order || 3;  //魔方阶数
    this.borderLength = this.opts.borderLength || 240;  //魔方边长
    this.boxBorderLength = parseInt(this.borderLength / this.order / 2) * 2;
    this.borderLength = this.boxBorderLength * this.order;
    this.vColor = this.opts.vColor || '#999';   //魔方颜色（底部）
    this.mouseSen = this.opts.mouseSen || 0.5;  //鼠标灵敏度
    this.oneTime = this.opts.oneTime || 500;    //魔方转动一次的动画时间
    this.oneTimeBatch = this.opts.oneTimeBatch || 300;  //批量操作时间
    this.cache = typeof this.opts.cache == 'undefined' ? true : this.opts.cache;    //缓存
    this.cacheinfo = this.getCache();
    this.trunOn = typeof(this.opts.trunOn) == 'undefined' ? true : this.opts.trunOn;
    this.trunArrowColor = this.opts.trunArrowColor || 'pink';
    this.trunBack = this.opts.trunBack; //回退函数
    this.record = [];
    this.foots = this.cacheinfo.foots || 0;
    this.container.innerHTML = '';
    this.boxsData = [];
    this.boxsDataLength = Math.pow(this.order, 3);
    //新建boxsDataLength阶的魔方的每个面的容器
    for (var i = 0; i < this.boxsDataLength; i++) {
        var c = {};
        c.dom = document.createElement('div');
        this.container.appendChild(c.dom);
        c.faces = [];
        for (var j = 0; j < 6; j++) {
            var d = document.createElement('div');
            c.dom.appendChild(d);
            c.faces.push(d)
        }
        c.x = c.intx = i % this.order;
        c.y = c.inty = (parseInt(i / this.order)) % this.order;
        c.z = c.intz = (parseInt(i / Math.pow(this.order, 2))) % this.order;
        this.boxsData.push(c)
    }

    this.trunOn && this.addArrow();
    this.initStyle();
    this.initColors = this.opts.colors || [
        ['yellow'],
        ['white'],
        ['blue'],
        ['green'],
        ['red'],
        ['orange']
    ];
    this.colors = this.cacheinfo.colors || this.initColors;
    this.setColor(this.colors);
    this.containerMouseMove()
}

Cube.prototype.getCache = function() {
    if (!this.cache) return {};
    return JSON.parse(localStorage['cube' + this.id + this.order] || '{}')
}

Cube.prototype.setCache = function(a) {
    if (!this.cache) return;
    for (var b in a) {
        this.cacheinfo[b] = a[b]
    }
    localStorage['cube' + this.id + this.order] = JSON.stringify(this.cacheinfo)
};

//设置每个可移动位置的箭头
Cube.prototype.addArrow = function() {
    var d = this.order;
    var b = this.order - 1;

    var e = [{
        y: 0
    }, {
        y: b
    }, {
        x: 0
    }, {
        x: b
    }, {
        z: b
    }, {
        z: 0
    }];

    var f = [{
        up: {
            coor: 'x',
            dir: 1
        },
        bottom: {
            coor: 'x',
            dir: 0
        },
        left: {
            coor: 'z',
            dir: 0
        },
        right: {
            coor: 'z',
            dir: 1
        }
    }, {
        up: {
            coor: 'x',
            dir: 0
        },
        bottom: {
            coor: 'x',
            dir: 1
        },
        left: {
            coor: 'z',
            dir: 1
        },
        right: {
            coor: 'z',
            dir: 0
        }
    }, {
        up: {
            coor: 'y',
            dir: 0
        },
        bottom: {
            coor: 'y',
            dir: 1
        },
        left: {
            coor: 'z',
            dir: 1
        },
        right: {
            coor: 'z',
            dir: 0
        }
    }, {
        up: {
            coor: 'y',
            dir: 1
        },
        bottom: {
            coor: 'y',
            dir: 0
        },
        left: {
            coor: 'z',
            dir: 0
        },
        right: {
            coor: 'z',
            dir: 1
        }
    }, {
        up: {
            coor: 'x',
            dir: 1
        },
        bottom: {
            coor: 'x',
            dir: 0
        },
        left: {
            coor: 'y',
            dir: 0
        },
        right: {
            coor: 'y',
            dir: 1
        }
    }, {
        up: {
            coor: 'x',
            dir: 0
        },
        bottom: {
            coor: 'x',
            dir: 1
        },
        left: {
            coor: 'y',
            dir: 1
        },
        right: {
            coor: 'y',
            dir: 0
        }
    }, ];

    for (var i = 0; i < 6; i++) {
        var g = this.getDomByPos(e[i]);
        for (var j = 0; j < g.length; j++) {
            if (parseInt(j / d) == 0) {
                g[j].faces[i].innerHTML += '<div class="arrow top" coor="' + f[i].up.coor + '" num="' + (j % d) + '" dir="' + f[i].up.dir + '"></div>'
            }
            if (parseInt(j / d) == b) {
                g[j].faces[i].innerHTML += '<div class="arrow bottom" coor="' + f[i].bottom.coor + '" num="' + (j % d) + '" dir="' + f[i].bottom.dir + '"></div>'
            }
            if (j % d == 0) {
                g[j].faces[i].innerHTML += '<div class="arrow left" coor="' + f[i].left.coor + '" num="' + parseInt(j / d) + '" dir="' + f[i].left.dir + '"></div>'
            }
            if (j % d == b) {
                g[j].faces[i].innerHTML += '<div class="arrow right" coor="' + f[i].right.coor + '" num="' + parseInt(j / d) + '" dir="' + f[i].right.dir + '"></div>'
            }
        }
    }
    //箭头的位置
    var h = parseInt(this.boxBorderLength / 2);
    var k = parseInt(this.boxBorderLength / 4);
    var l = parseInt(this.boxBorderLength / 5);

    var m = this.container.getElementsByClassName('arrow');
    var n = this.container.getElementsByClassName('top');
    var o = this.container.getElementsByClassName('bottom');
    var p = this.container.getElementsByClassName('left');
    var q = this.container.getElementsByClassName('right');
    //初始化箭头属性
    for (var i = 0; i < m.length; i++) {
        m[i].style.position = 'absolute';
        m[i].style.cursor = 'pointer';
        m[i].style.display = 'none';
        m[i].style.width = '0';
        m[i].style.height = '0'
    }
    //初始化魔方每个可移动的箭头
    var r = n.length;
    for (var i = 0; i < r; i++) {
        n[i].style.borderLeft = n[i].style.borderRight = h / 2 + 'px solid transparent';
        n[i].style.borderBottom = l + 'px solid ' + this.trunArrowColor;
        n[i].style.left = k + 'px';
        n[i].style.top = 0;
        o[i].style.borderLeft = o[i].style.borderRight = h / 2 + 'px solid transparent';
        o[i].style.borderTop = l + 'px solid ' + this.trunArrowColor;
        o[i].style.left = k + 'px';
        o[i].style.bottom = 0;
        p[i].style.borderTop = p[i].style.borderBottom = h / 2 + 'px solid transparent';
        p[i].style.borderRight = l + 'px solid ' + this.trunArrowColor;
        p[i].style.top = k + 'px';
        p[i].style.left = 0;
        q[i].style.borderTop = q[i].style.borderBottom = h / 2 + 'px solid transparent';
        q[i].style.borderLeft = l + 'px solid ' + this.trunArrowColor;
        q[i].style.top = k + 'px';
        q[i].style.right = 0
    }
    //鼠标点击状态
    for (var i = 0; i < this.boxsDataLength; i++) {
        var s = this.boxsData[i].faces;
        for (var j = 0; j < 6; j++) {
            s[j].onmouseenter = function() {
                var a = this.getElementsByClassName('arrow');
                var b = a.length;
                for (var j = 0; j < b; j++) {
                    a[j].style.display = 'block'
                }
            };
            s[j].onmouseleave = function() {
                var a = this.getElementsByClassName('arrow');
                var b = a.length;
                for (var j = 0; j < b; j++) {
                    a[j].style.display = 'none'
                }
            }
        }
    }
    var t = this;
    for (var i = 0; i < m.length; i++) {
        m[i].onclick = function() {
            var a = this.getAttribute('coor');
            var b = this.getAttribute('num');
            var c = this.getAttribute('dir');
            t.trun(a, b, Number(c))
        }
    }
}

Cube.prototype.initStyle = function() {
    var a = this.cacheinfo;
    var x = this.rotateX = a.x || 0;
    var y = this.rotateY = a.y || 0;
    var z = this.rotateZ = a.z || 0;
    this.container.style.width = this.container.style.height = this.borderLength + 'px';
    this.container.style.positon = 'relative';
    this.container.style.WebkitTransformStyle = 'preserve-3d';
    this.container.style.WebkitTransform = 'perspective(800px) rotateZ(' + z + 'deg) rotateY(' + y + 'deg) rotateX(' + x + 'deg)';
    for (var i = 0; i < this.boxsDataLength; i++) {
        this.boxsData[i].dom.style.position = 'absolute';
        this.boxsData[i].dom.style.width = this.boxsData[i].dom.style.height = this.boxBorderLength + 'px';
        this.boxsData[i].dom.style.left = this.boxsData[i].dom.style.top = (this.order / 2 - 0.5) * this.boxBorderLength + 'px';
        var x = this.boxsData[i].translateX = (this.boxsData[i].x + 0.5 - (this.order / 2)) * this.boxBorderLength;
        var y = this.boxsData[i].translateY = (this.boxsData[i].y + 0.5 - (this.order / 2)) * this.boxBorderLength;
        var z = this.boxsData[i].translateZ = (this.boxsData[i].z + 0.5 - (this.order / 2)) * this.boxBorderLength;
        var b = this.boxsData[i].rotateX = 0;
        var c = this.boxsData[i].rotateY = 0;
        var d = this.boxsData[i].rotateZ = 0;
        this.boxsData[i].dom.style.WebkitTransformStyle = 'preserve-3d';
        this.boxsData[i].dom.style.WebkitTransform = 'rotateX(' + b + 'deg) rotateY(' + c + 'deg) rotateZ(' + d + 'deg) translateZ(' + z + 'px) translate(' + x + 'px,' + y + 'px)';
        for (var j = 0; j < 6; j++) {
            this.boxsData[i].faces[j].style.position = 'absolute';
            this.boxsData[i].faces[j].style.top = this.boxsData[i].faces[j].style.left = 0;
            this.boxsData[i].faces[j].style.width = this.boxsData[i].faces[j].style.height = '100%';
            this.boxsData[i].faces[j].style.border = '2px solid ' + this.vColor;
            this.boxsData[i].faces[j].style.boxSizing = 'border-box';
            this.boxsData[i].faces[j].style.background = this.vColor;
            this.boxsData[i].faces[j].style.borderRadius = parseInt(this.boxBorderLength / 10) + 'px';
            var e = 0,
                ty = 0,
                tz = 0,
                b = 0,
                c = 0,
                d = 0;
            switch (j) {
                case 0:
                    ty = -this.boxBorderLength / 2;
                    b = 90;
                    break;
                case 1:
                    ty = this.boxBorderLength / 2;
                    b = 90;
                    break;
                case 2:
                    e = -this.boxBorderLength / 2;
                    c = 90;
                    b = 90;
                    break;
                case 3:
                    e = this.boxBorderLength / 2;
                    c = 90;
                    b = 90;
                    break;
                case 4:
                    tz = this.boxBorderLength / 2;
                    break;
                case 5:
                    tz = -this.boxBorderLength / 2;
                    break
            }
            var f = '';
            f += e ? 'translateX(' + e + 'px) ' : '';
            f += ty ? 'translateY(' + ty + 'px) ' : '';
            f += tz ? 'translateZ(' + tz + 'px) ' : '';
            f += b ? 'rotateX(' + b + 'deg) ' : '';
            f += c ? 'rotateY(' + c + 'deg) ' : '';
            f += d ? 'rotateZ(' + d + 'deg) ' : '';
            this.boxsData[i].faces[j].style.WebkitTransform = f
        }
    }
};
//删除颜色，只剩下材料的颜色
Cube.prototype.delColor = function() {
    for (var i = 0; i < this.boxsDataLength; i++) {
        var a = this.boxsData[i].faces;
        for (var j = 0; j < 6; j++) {
            a[j].style.backgroundColor = this.vColor
        }
    }
}
//自己设定颜色
Cube.prototype.setColor = function(c) {
    var d = this;
    this.delColor();
    this.colors = c || (function() {
        var a = [];
        for (var i = 0; i < d.initColors.length; i++) {
            var b = d.initColors[i].slice(0);
            a.push(b)
        }
        return a
    })();
    for (i = 0; i < +6; i++) {
        if (!this.colors[i]) {
            this.colors[i] = this.colors[i - 1]
        }
        for (var j = 0; j < Math.pow(this.order, 2); j++) {
            if (!this.colors[i][j]) {
                this.colors[i][j] = this.colors[i][j - 1]
            }
        }
    }
    var b = this.order - 1;
    var e = [{
        y: 0
    }, {
        y: b
    }, {
        x: 0
    }, {
        x: b
    }, {
        z: b
    }, {
        z: 0
    }];
    for (var i = 0; i < 6; i++) {
        var f = this.getDomByPos(e[i]);
        for (var j = 0; j < f.length; j++) {
            f[j].faces[i].style.background = this.colors[i][j]
        }
    }
};

//初始化魔方
Cube.prototype.initColor = function() {
    this.foots = 0;
    this.setCache({
        foots: 0
    });
    this.record = [];
    this.setColor()
}
//
Cube.prototype.getDomByPos = function(a) {
    var b = [];
    var a = a || {};
    var x = /[\d+]/.test(a.x) ? a.x : 'all';
    var y = /[\d+]/.test(a.y) ? a.y : 'all';
    var z = /[\d+]/.test(a.z) ? a.z : 'all';
    for (var i = 0; i < this.boxsDataLength; i++) {
        if ((this.boxsData[i].x == x || x == 'all') && (this.boxsData[i].y == y || y == 'all') && (this.boxsData[i].z == z || z == 'all')) {
            b.push(this.boxsData[i])
        }
    }
    return b
};
//拖动魔方
Cube.prototype.drag = function(k, l, m, n) {
    if (!k) return;
    if (arguments.length == 2) {
        var m = l;
        l = null
    }
    var o = function(e) {
        var f = e || event;
        var g = f.clientX;
        var h = f.clientY;
        l && l();
        var i = function(a) {
            var b = a || event;
            var c = b.clientX;
            var d = b.clientY;
            m && m(c - g, d - h);
            g = c;
            h = d
        };
        document.addEventListener('mousemove', i);
        var j = function() {
            document.removeEventListener('mousemove', i);
            document.removeEventListener('mousemove', i);
            n && n();
            k.releaseCapture && k.releaseCapture()
        };
        document.addEventListener('mouseup', j);
        k.setCapture && k.setCapture();
        e.preventDefault()
    };
    k.addEventListener('mousedown', o)
};
//拖动魔方，转换视角
Cube.prototype.containerMouseMove = function() {
    var e = this;
    this.oldRotateX = this.rotateX || 0;
    this.oldRotateY = this.rotateX || 0;
    this.oldRotateZ = this.rotateZ || 0;
    var f, scale2;
    var g = Math.PI / 180;
    this.drag(e.container, function() {}, function(a, b) {
        var c = e.rotateY % 360;
        if (c < 0) {
            c += 360
        }
        if (c > 180) {
            c = 360 - c
        }
        f = Math.cos(c * g);
        var d = e.rotateY % 360;
        if (d < 0) {
            d += 360
        }
        if (d > 270) {
            d = 540 - d
        } else if (d < 90) {
            d = 180 - d
        }
        scale2 = Math.sin(d * g);
        e.rotateY += (a * e.mouseSen);
        e.rotateX -= (b * e.mouseSen * f);
        if (e.rotateX > 45) {
            e.rotateX = 45
        } else if (e.rotateX < -45) {
            e.rotateX = -45
        }
        e.rotateZ -= (b * e.mouseSen * scale2);
        if (e.rotateZ > 45) {
            e.rotateZ = 45
        } else if (e.rotateZ < -45) {
            e.rotateZ = -45
        }
        e.setCache({
            x: e.rotateX,
            y: e.rotateY,
            z: e.rotateZ
        });
        e.container.style.WebkitTransform = 'perspective(800px) rotateY(' + e.rotateY + 'deg) rotateX(' + e.rotateX + 'deg) rotateZ(' + e.rotateZ + 'deg)'
    })
};
//初始化魔方的角度
Cube.prototype.initL = function() {
    this.rotateX = this.rotateY = this.rotateZ = 0;
    this.setCache({
        x: 0,
        y: 0,
        z: 0
    });
    this.container.style.WebkitTransform = 'perspective(800px) rotateY(' + this.rotateY + 'deg) rotateX(' + this.rotateX + 'deg) rotateZ(' + this.rotateZ + 'deg)'
};


Cube.prototype.trunRightColorChange = function(a, n) {
    if (!a) return;
    var n = n || 1;
    var b = [];
    var c = this.order;
    var d = a.length;
    var e = a.slice(0);
    for (var i = 0; i < n; i++) {
        b = e.slice(0);
        for (var j = 0; j < d; j++) {
            var f = (j % c) * c + c - 1 - parseInt(j / c);
            e[j] = b[f]
        }
    }
    return e
};
Cube.prototype.trunTabX = function(a) {
    if (!a) return;
    var b = a.slice(0);
    var c = this.order;
    var d = a.length;
    var e = [];
    for (var i = 0; i < d; i++) {
        var f = (c - 1 - parseInt(i / c)) * c + (i % c);
        e[i] = b[f]
    }
    return e
};
Cube.prototype.trunTabY = function(a) {
    if (!a) return;
    var b = a.slice(0);
    var c = this.order;
    var d = a.length;
    var e = [];
    for (var i = 0; i < d; i++) {
        var f = parseInt(i / c) * c + (c - 1 - i % c);
        e[i] = b[f]
    }
    return e
};

Cube.prototype.reSetColorBytrunEnd = function(a, b, c) {
    var d = [];
    var e = this.order;
    var f = e * e;
    var g = ['上', '下', '左', '右', '前', '后'];
    for (var i = 0; i < e; i++) {
        d.push(i)
    }
    var h = this.colors[0].slice(0);
    var j = this.colors[1].slice(0);
    var k = this.colors[2].slice(0);
    var l = this.colors[3].slice(0);
    var o = this.colors[4].slice(0);
    var p = this.colors[5].slice(0);
    switch (a) {
        case 'x':
            if (c) {
                for (var i = 0; i < this.order; i++) {
                    var n = Number(b) + e * i;
                    this.colors[0][n] = o[n];
                    this.colors[4][n] = this.trunTabX(j)[n];
                    this.colors[1][n] = p[n];
                    this.colors[5][n] = this.trunTabX(h)[n]
                }
                if (b == 0) {
                    this.colors[2] = this.trunRightColorChange(this.colors[2], 3)
                }
                if (b == e - 1) {
                    this.colors[3] = this.trunRightColorChange(this.colors[3], 3)
                }
            } else {
                for (var i = 0; i < this.order; i++) {
                    var n = Number(b) + e * i;
                    this.colors[4][n] = h[n];
                    this.colors[1][n] = this.trunTabX(o)[n];
                    this.colors[5][n] = j[n];
                    this.colors[0][n] = this.trunTabX(p)[n]
                }
                if (b == 0) {
                    this.colors[2] = this.trunRightColorChange(this.colors[2], 1)
                }
                if (b == e - 1) {
                    this.colors[3] = this.trunRightColorChange(this.colors[3], 1)
                }
            }
            break;
        case 'y':
            if (c) {
                for (var i = 0; i < this.order; i++) {
                    var m = Number(b) + e * i;
                    var n = Number(b) * e + i;
                    this.colors[4][n] = this.trunTabY(this.trunRightColorChange(k, 3))[n];
                    this.colors[3][m] = this.trunRightColorChange(o, 1)[m];
                    this.colors[5][n] = this.trunRightColorChange(this.trunTabY(l), 1)[n];
                    this.colors[2][m] = this.trunRightColorChange(p, 1)[m]
                }
                if (b == 0) {
                    this.colors[0] = this.trunRightColorChange(this.colors[0], 1)
                }
                if (b == e - 1) {
                    this.colors[1] = this.trunRightColorChange(this.colors[1], 1)
                }
            } else {
                for (var i = 0; i < this.order; i++) {
                    var n = Number(b) + e * i;
                    var m = Number(b) * e + i;
                    this.colors[2][n] = this.trunTabY(this.trunRightColorChange(o, 3))[n];
                    this.colors[4][m] = this.trunRightColorChange(l, 3)[m];
                    this.colors[3][n] = this.trunRightColorChange(this.trunTabY(p), 1)[n];
                    this.colors[5][m] = this.trunRightColorChange(k, 3)[m]
                }
                if (b == 0) {
                    this.colors[0] = this.trunRightColorChange(this.colors[0], 3)
                }
                if (b == e - 1) {
                    this.colors[1] = this.trunRightColorChange(this.colors[1], 3)
                }
            }
            break;
        case 'z':
            if (c) {
                for (var i = 0; i < this.order; i++) {
                    var m = Number(b) * e + i;
                    this.colors[0][m] = this.trunTabY(k)[m];
                    this.colors[2][m] = j[m];
                    this.colors[1][m] = this.trunTabY(l)[m];
                    this.colors[3][m] = h[m]
                }
                if (b == 0) {
                    this.colors[5] = this.trunRightColorChange(this.colors[5], 3)
                }
                if (b == e - 1) {
                    this.colors[4] = this.trunRightColorChange(this.colors[4], 3)
                }
            } else {
                for (var i = 0; i < this.order; i++) {
                    var m = Number(b) * e + i;
                    this.colors[2][m] = this.trunTabY(h)[m];
                    this.colors[1][m] = k[m];
                    this.colors[3][m] = this.trunTabY(j)[m];
                    this.colors[0][m] = l[m]
                }
                if (b == 0) {
                    this.colors[5] = this.trunRightColorChange(this.colors[5], 1)
                }
                if (b == e - 1) {
                    this.colors[4] = this.trunRightColorChange(this.colors[4], 1)
                }
            }
            break
    }
    this.setColor(this.colors)
};

Cube.prototype.trun = function(a, b, c, d) {
    this.runing = this.runing || false;
    if (this.runing) return;
    var b = b || 0;
    if (b > this.order - 1) return;
    this.runing = true;
    if (c == false) {
        var c = false
    } else {
        var c = true
    };
    this.foots++;
    this.setCache({
        foots: this.foots
    });
    var e = {};
    e[a] = b;
    var f = this.seletDoms = this.getDomByPos(e);
    var n = 0;
    var g = f.length;
    var h = this;

    function transend() {
        this.removeEventListener('transitionend', transend, false);
        this.style.transition = 'none';
        n++;
        if (n == g) {
            h.reSetColorBytrunEnd(a, b, c);
            for (var i = 0; i < g; i++) {
                f[i].dom.style.WebkitTransform = 'rotateZ(0deg) rotateY(0deg) rotateX(0deg)  translateZ(' + f[i].translateZ + 'px) translate(' + f[i].translateX + 'px,' + f[i].translateY + 'px)'
            }
            h.record.push({
                coor: a,
                num: b,
                dir: c
            });
            h.runing = false;
            h.trunBack && h.trunBack({
                coor: a,
                num: b,
                dir: c
            });
            d && d()
        }
    }
    for (var i = 0; i < g; i++) {
        f[i].dom.style.transition = this.oneTime / 1000 + 's all ease';
        var j = 0,
            dry = 0,
            drz = 0;
        var k = c ? 1 : -1;
        switch (a) {
            case 'x':
                j = 90 * k;
                break;
            case 'y':
                dry = 90 * k;
                break;
            case 'z':
                drz = 90 * k;
                break
        }
        f[i].dom.addEventListener('transitionend', transend, false);
        f[i].dom.style.WebkitTransform = 'rotateZ(' + drz + 'deg) rotateY(' + dry + 'deg) rotateX(' + j + 'deg)  translateZ(' + f[i].translateZ + 'px) translate(' + f[i].translateX + 'px,' + f[i].translateY + 'px)'
    }
};
Cube.prototype.back = function() {
    var a = this;
    var b = this.record.pop();
    if (b) {
        this.trun(b.coor, b.num, !b.dir, function() {
            a.record.pop()
        });

    }
};
Cube.prototype.getFoots = function() {
    return this.foots
};
Cube.prototype.getRandom = function(a, b) {
    return parseInt(a + Math.random() * (b - a))
};
Cube.prototype.random = function(n) {
    var e = this;
    var n = n || 30;
    var i = 0;
    var f = this.oneTime;
    var g = this.order;
    var h = ['x', 'y', 'z'];
    var j = parseInt(1000 / n);
    this.oneTime = j < 50 ? 50 : j;

    function trun_random() {
        i++;
        if (i > n) {
            e.oneTime = f
        } else {
            var b = h[e.getRandom(0, 3)];
            var c = e.getRandom(0, g);
            var d = e.getRandom(0, 2);
            e.trun(b, c, d, function() {
                var a = setTimeout(function() {
                    clearTimeout(a);
                    trun_random()
                }, 0)
            })
        }
    }
    trun_random()
};