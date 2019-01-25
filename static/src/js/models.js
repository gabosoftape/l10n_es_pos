/* Copyright 2016 David Gómez Quilón <david.gomez@aselcis.com>
   License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
*/
odoo.define('l10n_es_pos.models', function (require) {
    "use strict";
    var models = require('point_of_sale.models');
    var pos_super = models.PosModel.prototype;
    var flag = true;
    var caducidad_coupon1 = undefined;
    var caducidad_coupon2 = undefined;
    var field_utils = require('web.field_utils');


    function validar_cupones () {
      var fecha= new Date();
      var actual_fecha = field_utils.format.datetime(
          moment(fecha), {}, {timezone: false});
      console.log(actual_fecha);
    }
    models.PosModel = models.PosModel.extend({
        initialize: function (attributes, options) {
            pos_super.initialize.apply(this, arguments);
            this.pushed_simple_invoices = [];
            this.pushed_normal_invoices = [];
            return this;
        },
        get_simple_inv_next_number: function () {
          console.log("entramos al metodo");
            if (this.pushed_simple_invoices.indexOf(this.config.l10n_es_simplified_invoice_number) > -1) {
              console.log("aqui se obtuvo (get simple inv next number).."+this.config.l10l10n_es_simplified_invoice_number);
                ++this.config.l10n_es_simplified_invoice_number;
                console.log("aqui se aumento ? "+this.config.l10n_es_simplified_invoice_number);
            }
            console.log("no entramos al if");
            return this.config.l10n_es_simplified_invoice_prefix+this.get_padding_simple_inv(this.config.l10n_es_simplified_invoice_number);
        },
        get_normal_inv_next_number: function () {
          console.log("entramos al get numero siguiente para ordenes en efectivo");
            var prefix_ord = "Orden-00"
            var order = this.get_order();
            var lines = this.get_order().get_paymentlines();
            var new_ordername = null;
            console.log("como el medio de pago es: "+lines[0].name+" y ... ");
            if (lines.length<=1) {
              console.log("solo hay un medio de pago EMPEZAMOS A VALIDAR LAS VARIABLES DE EFECTIVO");
              if (lines[0].name == "Efectivo BCM (COP)") {
                console.log("el numero normal de la secuencia BCM  de orden es: "+this.config.l10n_es_simplified_invoice_number_efectivo_CM);
                new_ordername = prefix_ord+order.pos_session_id+"-0"+this.config.l10n_es_simplified_invoice_number_efectivo_CM;
              }else if (lines[0].name == "Efectivo BPI (COP)") {
                console.log("el numero normal de la secuencia BPI de orden es: "+this.config.l10n_es_simplified_invoice_number_efectivo_PI);
                new_ordername = prefix_ord+order.pos_session_id+"-0"+this.config.l10n_es_simplified_invoice_number_efectivo_PI;
              }else if (lines[0].name == "Efectivo Venecia (COP)") {
                console.log("el numero normal de la secuencia Venecia de orden es: "+this.config.l10n_es_simplified_invoice_number_efectivo_venecia);
                new_ordername = prefix_ord+order.pos_session_id+"-0"+this.config.l10n_es_simplified_invoice_number_efectivo_venecia;
              }else {
                console.log("el numero normal de la secuencia null de orden es: "+this.config.l10n_es_simplified_invoice_number_normal);
                new_ordername = prefix_ord+order.pos_session_id+"-0"+this.config.l10n_es_simplified_invoice_number_normal;
              }
            }else {
              console.log("hay varios metodos de pago asi que rela");
              console.log("por si las moscas dejo el number normal secuence para computar en caso tal");
            }
            return new_ordername;
        },
        get_padding_simple_inv: function (number) {
            var diff = this.config.l10n_es_simplified_invoice_padding - number.toString().length;
            var result = '';
            if (diff <= 0) {
                result = number;
            } else {
                for (var i = 0; i < diff; i++) {
                    result += '0';
                }
                result += number;
            }
            return result;
        },
        push_simple_invoice: function (order) {
          console.log("pusheamos simple invoice");
          validar_cupones();

            if (this.pushed_simple_invoices.indexOf(order.data.simplified_invoice) === -1) {
                this.pushed_simple_invoices.push(order.data.simplified_invoice);
                ++this.config.l10n_es_simplified_invoice_number;
                console.log("aumentamos secuencia simplified invoice");
            }
        },
        push_normal_invoice: function (order, number) {
          console.log("pusheamos normal invoice");
          validar_cupones();
                this.pushed_normal_invoices.push(order.data.simplified_invoice);
                if (number == 0) {
                  this.config.l10n_es_simplified_invoice_number_normal++;
                  console.log("aumentamos secuencia normal");
                } else if (number == 1) {
                  this.config.l10n_es_simplified_invoice_number_efectivo_CM++;
                  console.log("aumentamos la secuencia de efectivo centro mayor? "+this.config.l10n_es_simplified_invoice_number_efectivo_CM);
                } else if (number == 2) {
                  this.config.l10n_es_simplified_invoice_number_efectivo_PI++;
                  console.log("aumentamos la secuencia de efectivo Plaza imperial");
                } else if (number == 3) {
                  this.config.l10n_es_simplified_invoice_number_efectivo_venecia++;
                  console.log("aumentamos la secuencia de efectivo venecia");
                }

                console.log("salimos del comparador");
        },
        _flush_orders: function (orders, options) {
          console.log("entramos a metodo flush");
            var self = this;
            var  lines = this.get_order().get_paymentlines();
            var number=0;
            // Save pushed orders numbers
            _.each(orders, function (order) {
              console.log("entramos al comparativo del flush ... each");
              // console.log(lines[0].name + "hhhhhhhhhhhhhhhhhhhhhhhhh")
                if (!order.data.to_invoice) {
                  console.log("entramos al if |no es una factura| .. comparando el data");

                  if (lines.length < 1) {
                  console.log("no hay medio de pago todavia, bro!");

              }else if (lines.length == 1) {
                console.log("solo hay un medio de pago");
              if (lines[0].name =="REDEBAN BCM (COP)") {
                  console.log("token BCM COP");
                  self.push_simple_invoice(order);
                  console.log("OK, pushed. :P");
              } else if (lines[0].name =="REDEBAN BPI (COP)") {
                console.log("token BPI COP");
                self.push_simple_invoice(order);
                console.log("OK, pushed. :P");
              }else if (lines[0].name =="REDEBAN VENECIA (COP)") {
                console.log("token venecia COP");
                self.push_simple_invoice(order);
                console.log("OK, pushed. :P");
              } else if (lines[0].name =="Efectivo BCM (COP)") {
                console.log("token EFECTIVO CENTRO MAYOR");
                number=1;
                self.push_normal_invoice(order , number);
                console.log("OK, pushed. :P");
              } else if (lines[0].name =="Efectivo BPI (COP)") {
                number=2;
                console.log("token EFECTIVO PLAZA IMPERIAL");
                self.push_normal_invoice(order , number);
                console.log("OK, pushed. :P");
              } else if (lines[0].name =="Efectivo Venecia (COP)") {
                number=3;
                console.log("token EFECTIVO VENECIA");
                self.push_normal_invoice(order , number);
                console.log("OK, pushed. :P");
              } else {
                console.log("token EFECTIVO sin mas");
                self.push_normal_invoice(order, 0);
                console.log("OK, pushed. :P ... ojo , algo anda mal.. por favor revisa el codigo bro");
              }

              }else {
                console.log("!!!!!!!!!existen 2 o mas medios de pago .. por tal motivo haremos lo siguiente.");
                console.log("token REDEBAN obligado");
                self.push_simple_invoice(order);
                console.log("OK, pushed. :P");
              }

            }
            });
            return pos_super._flush_orders.apply(this, arguments);
        },
    });

    var order_super = models.Order.prototype;
    models.Order = models.Order.extend({
        get_total_with_tax: function () {
            var total = order_super.get_total_with_tax.apply(this, arguments);
            var below_limit = total <= this.pos.config.l10n_es_simplified_invoice_limit;
            this.is_simplified_invoice = below_limit && this.pos.config.iface_l10n_es_simplified_invoice;
            return total;
        },
        set_simple_inv_number: function () {
          console.log("entramos al metodo set simple");
            this.simplified_invoice = this.pos.get_simple_inv_next_number();
          console.log("mostramos el nuevo numero de factura ... "+this.simplified_invoice);
            this.name = this.simplified_invoice;
          console.log("seteamos el numero anterior en order.name ... "+this.name);
            this.is_simplified_invoice = true;
          console.log("seteamos false a la variable flag .. es una factura simplificada? ");
            flag = true;
        },
        set_normal_inv_number: function (flag) {
          console.log("seteamos numero de orden"+flag);
          this.simplified_invoice = this.pos.get_normal_inv_next_number();
          console.log("mostramos el nuevo numero de factura ... "+this.simplified_invoice);
          this.name = this.simplified_invoice;
          console.log("seteamos el numero anterior en order.name ... "+this.name);
          this.is_simplified_invoice = false;
          console.log("seteamos false a la variable flag .. es una factura simplificada? ");
          flag = false;
        },
        get_base_by_tax: function () {
            var base_by_tax = {};
            this.get_orderlines().forEach(function (line) {
                var tax_detail = line.get_tax_details();
                var base_price = line.get_price_without_tax();
                if (tax_detail) {
                    Object.keys(tax_detail).forEach(function (tax) {
                        if (Object.keys(base_by_tax).includes(tax)) {
                            base_by_tax[tax] += base_price;
                        } else {
                            base_by_tax[tax] = base_price;
                        }
                    });
                }
            });
            return base_by_tax;
        },
        init_from_JSON: function (json) {
            order_super.init_from_JSON.apply(this, arguments);
            this.to_invoice = json.to_invoice;
            this.simplified_invoice = json.simplified_invoice;
        },
        export_as_JSON: function () {
            var res = order_super.export_as_JSON.apply(this, arguments);
            res.to_invoice = this.is_to_invoice();
            if (!res.to_invoice) {
                res.simplified_invoice = this.simplified_invoice;
            }
            return res;
        },
    });

    models.load_fields('res.company', ['street', 'city', 'state_id', 'zip']);

});
