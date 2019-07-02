/* Copyright 2016 David Gómez Quilón <david.gomez@aselcis.com>
   Copyright 2018 David Vidal <david.vidal@tecnativa.com>
   License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
*/

odoo.define('l10n_es_pos.screens', function (require) {
    "use strict";

    var screens = require('point_of_sale.screens');
    var count = 3


    screens.PaymentScreenWidget.include({
        // When the order total is above the simplified invoice limit, wich
        // will be the legal one on each case, it's mandatory to force the
        // invoice in any case.
        validate_order: function (force_validate) {
            var below_limit = this.pos.get_order().get_total_with_tax() <=
                this.pos.config.l10n_es_simplified_invoice_limit;
            var lines = this.pos.get_order().get_paymentlines();    
            if (this.pos.config.iface_l10n_es_simplified_invoice) {
                var order = this.pos.get_order();
                if (below_limit && !order.to_invoice) {
                    if (lines.length<=1) {
                        console.log("solo hay un medio de pago");
                        if (lines[0].name =="REDEBAN (COP)") {
                            order.set_simple_inv_number();
                        } 
                        else {
                            console.log(count);
                            if (count > 10){
                             order.set_simple_inv_number();   
                             count = 0   
                             console.log("Venta añadida");
                            } 
                            else { 
                               order.to_invoice = true; 
                               count = count + 1;
                               console.log("Venta Omitida");
                            }
                        }
                    }
                    else {
                        console.log("hay mas de un medio de pago");
                        order.set_simple_inv_number();
                    
                    }
                } else {
                    // Force invoice above limit. Online is needed.
                    order.to_invoice = true;
                }
            }
            this._super(force_validate);
        },
    });

});
