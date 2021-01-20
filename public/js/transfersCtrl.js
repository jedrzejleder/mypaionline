var app = angular.module('paionline')

app.controller('TransfersCtrl', [ '$http', 'common', function($http, common) {
    console.log('Kontroler TransfersCtrl startuje')
    var ctrl = this

    ctrl.formatDateTime = common.formatDateTime

    ctrl.history = []
    ctrl.MyHistory = []
    ctrl.uniqueHistory = []
    ctrl.uniqueHelp = null

    ctrl.recipients = []
    ctrl.recipient = null

    ctrl.transfer = {
        delta: 1.00
    }

    ctrl.transfer2 = {
        delta: 1.00
    }

    ctrl.amount = 0

    var refreshHistory = function() {
        $http.get('/transfer').then(
            function(res) {
                ctrl.history = res.data

                for(var i = 0; i < ctrl.history.length; i++) {
                    ctrl.MyHistory.push(ctrl.history[i])
                }

                for (var i = 0; i < ctrl.MyHistory.length; i++) {
                    if(ctrl.MyHistory[i].delta > 0) {
                        ctrl.MyHistory.splice(i, 1)
                        i--
                    }
                }

                ctrl.uniqueHistory =[]
                for (var i = 0; i < ctrl.MyHistory.length; i++) 
                { 
                    var j; 
                    for (j = 0; j < i; j++) {
                        if (ctrl.MyHistory[i].recipient == ctrl.MyHistory[j].recipient) {
                            break
                        }
                    }
            
                    if (i == j) {
                        ctrl.uniqueHistory.push(ctrl.MyHistory[i])
                    }
                } 
                
                $http.delete('/transfer').then(
                    function(res) { ctrl.amount = res.data.amount },
                    function(err) {}
                )
            },
            function(err) {}    
        )
    }


    refreshHistory()

    // ctrl.doTransfer = function() {
    //     $http.post('/transfer?recipient=' + ctrl.recipient._id, ctrl.transfer2).then(
    //         function(res) {
    //             refreshHistory()
    //         },
    //         function(err) {}
    //     )
    // }

    // ctrl.doTransfer2 = function() {
    //     $http.post('/transfer?recipient=' + ctrl.uniqueHelp.recipient, ctrl.transfer).then(
    //         function(res) {
    //             refreshHistory()
    //         },
    //         function(err) {}
    //     )
    // }

    ctrl.doTransfer3 = function() {
        $http.post('/transfer?recipient=' + ctrl.uniqueHelp, ctrl.transfer2).then(
            function(res) {
                refreshHistory()
            },
            function(err) {}
        )
        ctrl.uniqueHelp = null
    }

    $http.get('/personList').then(
        function(res) {
            ctrl.recipients = res.data
            ctrl.recipient = null
        }, 
        function(err) {
            ctrl.recipients = []
            ctrl.recipient = null
        }
    )
}])