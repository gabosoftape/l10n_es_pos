/* Copyright 2016 David Gómez Quilón <david.gomez@aselcis.com>
   Copyright 2018 David Vidal <david.vidal@tecnativa.com>
   License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
*/

odoo.define('l10n_es_pos.screens', function (require) {
    "use strict";

    var screens = require('point_of_sale.screens');



    screens.PaymentScreenWidget.include({
        validate_order: function (force_validate) {
          console.log('Entramos a la validacion de la orden... ');
            var below_limit = this.pos.get_order().get_total_with_tax() <= this.pos.config.l10n_es_simplified_invoice_limit;
            var lines = this.pos.get_order().get_paymentlines();
                if (lines.length<=1) {
                  console.log("solo hay un medio de pago");
                if (lines[0].name =="REDEBAN BCM (COP)") {
                    if (this.pos.config.iface_l10n_es_simplified_invoice) {
                      console.log('iface_l10n_es_simplified_invoice esta en True por eso haremos lo siguiente ');
                        var order = this.pos.get_order();
                        if (below_limit) {
                            order.set_simple_inv_number();
                            var dias = order.date_order;
                            console.log("el primer cupon seria para .. "+dias);
                            console.log("seteamos el numero de factura");
                        } else {
                            // Force invoice above limit. Online is needed.
                            order.to_invoice = true;
                        }
                      }
                } else if (lines[0].name =="REDEBAN BPI (COP)")) {
                    if (this.pos.config.iface_l10n_es_simplified_invoice) {
                      console.log('iface_l10n_es_simplified_invoice esta en True por eso haremos lo siguiente ');
                        var order = this.pos.get_order();
                        if (below_limit) {
                            order.set_simple_inv_number();
                            var dias = order.date_order;
                            console.log("el primer cupon seria para .. "+dias);
                            console.log("seteamos el numero de factura");
                        } else {
                            // Force invoice above limit. Online is needed.
                            order.to_invoice = true;
                        }
                      }
                }else if (lines[0].name ==("REDEBAN VENECIA (COP)")) {
                    if (this.pos.config.iface_l10n_es_simplified_invoice) {
                      console.log('iface_l10n_es_simplified_invoice esta en True por eso haremos lo siguiente ');
                        var order = this.pos.get_order();
                        if (below_limit) {
                            order.set_simple_inv_number();
                            var dias = order.date_order;
                            console.log("el primer cupon seria para .. "+dias);
                            console.log("seteamos el numero de factura");
                        } else {
                            // Force invoice above limit. Online is needed.
                            order.to_invoice = true;
                        }
                      }
                } else {
                  var order = this.pos.get_order();
                  console.log('iface_l10n_es_simplified_invoice esta en false por eso haremos lo siguiente ');
                  order.set_normal_inv_number();
                  console.log('seteamos correctamente el nuevo valor de la factura');

                }
            } else {
              console.log("!!!!!!!!!existen 2 o mas medios de pago .. por tal motivo haremos lo siguiente.");
              if (this.pos.config.iface_l10n_es_simplified_invoice) {
                console.log('iface_l10n_es_simplified_invoice esta en True por eso haremos lo siguiente ');
                  var order = this.pos.get_order();
                  if (below_limit) {
                      order.set_simple_inv_number();
                      var dias = order.date_order;
                      console.log("el primer cupon seria para .. "+dias);
                      console.log("seteamos el numero de factura");
                  } else {
                      // Force invoice above limit. Online is needed.
                      order.to_invoice = true;
                  }
                }
            }
            this._super(force_validate);
        }
    });

});
