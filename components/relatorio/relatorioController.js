angular.module("yara")
.controller("relatorioController",function($scope, $http){
    $scope.$on('$viewContentLoaded', function(){
        
        $('#datatable').DataTable({
            "language": {
                "decimal": "",
                "emptyTable": "Nenhum resultado encontrado",
                "info": "Mostrando _START_ à _END_ de _TOTAL_ resultados",
                "infoEmpty": "Mostrando 0 à 0 de 0 resultados",
                "infoFiltered": "(filtrado de _MAX_ total resultados)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ resultados",
                "loadingRecords": "Carregando...",
                "processing": "Processando...",
                "search": "Procurar entrada:",
                "zeroRecords": "Nenhum resultado encontrado com a busca",
                "paginate": {
                    "first": "Primeira",
                    "last": "Última",
                    "next": "Próxima",
                    "previous": "Anterior"
                },
                "aria": {
                    "sortAscending": ": Ative para ordenar a coluna em ordem crescente",
                    "sortDescending": ": Ative para ordenar a coluna em ordem decrescente"
                }
            },
            "pagingType": "full_numbers",
            "lengthMenu": [
                [10, 25, 50, -1],
                [10, 25, 50, "All"]
            ],
            responsive: true,
        });

        //Biblioteca Auto Tables//
        //https://github.com/simonbengtsson/jsPDF-AutoTable

        //Biblioteca JSPDF Documentação//
        //https://rawgit.com/MrRio/jsPDF/master/docs/index.html

        //Função do PDF//
        $('#pdf_button').click(function() {

            //Logo do Yara em base 64//
            imgData="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH4gIcFgwNPfhHHQAAOeZJREFUeF7tnWdgXMXV92fmbpVWu+q9d8lqllxkyd2Wu40NxgZDsCEhgSd5n0BIIAkkdMJDQgIhkEIzOBBjHDDuvVsukqxqq1i991XZ1dY7835YkKXdu7dIWllK9oe/sPfsaPbO/87MPXNmDiSEACdOJhrEZeDEyVhwCsuJQ3AKy4lDELFfHtIZ6xq76pu6tVoDgOy2Tv4rUCldIkK8Q4O9ZFIxi5ldYWm0+v3Hivbsv1Z8o7GvX0dj7NSVEwAARSFPD0V6Sti2TZmrlibbkxdkfCusqe988Q/fHDheNKQ3UghC6BSVk9tgTDAhbq6yrRvnPPvE+kA/d1sbBmHV1Hc+9vQnF65UIYScinJiD0IIIWDN8pS/vPZggI22rCfvGq3+xT98c+FKFUU5VeWEDQghQvDwqZLX3zlsNJqtrloL68DxogPHixByvi064QUEYPe+q+cuV1p9PkpAQzrjnm+uDemNzr7KCU8ghH0DQ59/fcVkpkd+PkpYdY1dhTcaKeSUlRMBIAjzCuta2/tGfTjyf+qbuvv7dc53QCeCgBB29Qy0dfSN/HCUsLRaA40xcOJECBACk5ke1OhHfjh6kg6d3nUnY4SAUX4r59ufE4fgFJYTh8CxCD0tIIRgLCxekf86FSEAYzx1CkcQounw2j7thYUx8fRwjYsOkMvEgE8TQQAIuFnV2tHVz9n8hBCFqywhNlDhImW3/BYIIIBVte3Nrb18CneRSxNiA5Rucl41BwAhWN/UXdvQxWV455newsKY+Puq3nzhvpxFMyiK17COIDx6pvSpF3ZzGQJCiErp8tLTm7ZsmC0W87pRCMEzF8t/9jyvwuUyybNPrt+xNVsqYYs/GYZC8Hpp4xO/+ZwQwqnaOw6v+zU1IYSolPKXntl099oMLtvbnM2t+NWre1vb+9gHFEKIVCL+xf+s/v4DC/kvmuYX1//qtb11TV0U65oYIUAkov7f95f/+OGlEn6SBQDU1Hf++rW9xTcb2QufIkyDKjJCCBCLqCd+uGLb3ZlctrepuNX29Mt76hq7OKcpEMId983/nx1L+auqsaXnmZf3VNxq49HwZMuG2U89voq/qtR92l+/tvdyQTWPwqcE06OWthBCNq+f/ZNHlvG/0YMa/ct/2l9ys4lz0KQxXpwV/8v/t0Ym4zVIAQD0BtPr7xzKzavmLpzGczOifvvUXW4KGbvlMDTGf/7gxKGTJfx/7B1n2lR0JDTGM5PDnntyvcKVb9sAAD798tJBHoEbGJPwYO8XfrHRz0fFbjmSvQfyd++7xjn1wZgE+nu8+PONoUFe7JYjOXXh5j92ncPTalFk+gmLEOLlrnjuifURoT5ctrcpq2h596NTRhPN3vKEAJlU/NTjq2anRbAajqK+qfvt948P6QxcugISMfXTR5cvnBfHYTeCnl7Nm3891qPWcKp2SjH9hAUA2L41e+XSJC6r25jN9N8+OVPLY2qFMV6bkypo3kYI+fDz8zcqWzjHKZrGOYuTHr5vAbuZFbv3Xc3Nu8U5wk41pll1LYPg4zuWcrbiSK4U1Ow7UsA5DceYhAZ7/eyxla48vVYAAABKy5v/9fVVTv8sJiTAz/2px1Yq3eQcpiNoau39+IuLVqFO0wIBzXPHIQS4yqX/+4PlIYGeXLa3MZrMO7+42N3LPZQgBB+5f0F6chi72UgwJrv25ra09XL2hRDAh7ZkZWZEsZtZsfdAXnlVq6CnaIownWqMMV6+MHFdThqX4SiulzQcO1PG2fA0xmlJoQ/dm8VuZsXNqtZ9R64DrqAQjEliXOAj9y/kFPdImtvUn391ZZoGMk0bYRFCPNxdf/TQEkHjFCFkz/5rXT2DnC0qlYgefWBRoL8Hu5kVXx8uaG5Tc6pWJEKP3L8gLFjAmyAA4MipkopqPl6xqci0qTTGZMXipOw5MVyGo6ip7zx6upRTVTSNM1LC161IYzezorVdvf9YIedxPTTGyQkhm9YIWB4AAAwM6r46lG8yTb/ZlYXpISxCiIfKdcfWbKmEr6vawsnzNxtbejh7FIlE9NC92d6eCnYzK85drqyqbefsUcQU9eDmeQG+ArxiAID84vrrpQ2cXrcpy/SoN8ZkQWas0Jmvdshw6GSx2cwxR6ExnhEXtGppMruZFUaT+eCJYr3Bej+dFRiTmCj/9QLnhYSAQyeL+wd0XF3t1GV6CEsuE9+7YbZcJuEyHEVZRUthaQNnd4UgvHtNhr/AHqW6tuNKQQ1n4QCA9SvSQoIEvMYCANo6+s5eqpi+qgLTQlg0jRNiAxcJ8VZbOJtb0aPWsk+wMCGBfu5rlqWw2DBy4WpVe2c/u2+MEOLj5bZB4NQNAJBXXFfb2DV9x0EwLYQFIVy5OMnXW8llOArtkOHClUrOmTXGJHtubGy0P7uZFUaj+WxupZnmHGTJnPTIGfFB7Ga2nL1UodMZuaymNFNdWIQQD5VLziIBCzgWahu6yipaOIcqqUS0cnGSWESxm1nR1NpbWNbA6coXi6hVS+we9GOP7p7BKwU1XFZTnakuLIxJQmxgkvCHvqCkntPbjjEJCfQU+k4AACi+0dTW0c+uWkyIv68qe040iw0jlTXtfCLGpjhTXVgAgHmzogWtrwEACCHXCus4l9gwIRkp4aECZ9YAgLyiWoPBxG6DMUlJCBYUgmGhoLh+YHDa70ef6sJykUuyZgt+6NX9QyU3mzhbRkShebOjRALHQY3WUFjayGUFEIRzM6KEjoNmGheUNtDCdu5MRaa0sCx7JRJiArgMrWls6Wlo7uaMale6ydOTw1lsGGntUNfUd7L3KIQAVxfprNRwFhtGetWailut07y3AmCqC4uQmAg/oR4mAEBVTXv/AMdoggkJCfSMCPVmsWGkuq6zR62BXKr181FGh/uy2DDS3Nrb3KbmfC2Y+kxpYUEAEuOChPpFAQAVt9psz5izghAQGebjoXJlN7OlsrpNpzextzwmJDzEW6iLBABwq65zUKOf7hMsMMWFJRKhmEg/LitraBpX1rRzObAABCA+OkAsFjbBIoRUVrfz2XcdE+knlwt+JG7VdnA+EtOCKS0sqUQcHiJ4qBrU6Jvb1JzPvFhERYQJfmXT6U0NzT1cVgBBOIb3QYxJbUMnt2anA1NXWJbJ9RhGk/5BXSeP7fMSiShUSCSqhf5BXUf3AKePSSKhggKEhXYBAHR6Y3ObmstqejCVhQUUrlIPlQuXoTU9as2gRs+uK0KIq4vU00NYnAwAYGBQp+7j8LsSAsRikZ+P4EdiUKPvUWu4nojpwVQWFlEq5ApXAfGiFnp6NXqDiT1cmBDg6iLhv2V0mF61RqfncI0CQOQyscpN8COh0Ro4X2anC1NXWAAAV1cpRQmbXAMABgZ1RiPN1TpEJhXLeW90Hqavf8hoMgOuHstFJnGRCy5cO6Qf0hn/E2Q1lYVFAFC4SkUiwTXU6U2ccQeEAKlULBPuyNDpjbSZO62QSEQJdegDALRDRpqr5tMFwc02maAxrcQOavWAx3lTFEIUJbh4nd7k4PUWhxY+eUxpYY0NwhmENQ4IAY4s/j+HKS2ssUlEqZDx6YgwIQJPaQQAALlcLHLsbnc+dZ8GOPQejQsIgHbIMIY5h0wq5jzpAEKgN5j03O931lgK59QjTeMx1FwuF49hdJ6aTF1hAQA0WgPnHhtblG5yiVjE1ddBw5iE5a5ykYhFgLV0CMGQ3qjTC44tVrjI5DIJp2qnBVNXWBDCQY1+SHjzeHkqZDIx+ywYQqAdMgxoRyVT4IOXu4LHaWxQpzP2D+i4zKxRuEpVSjm7aqcLU1lYYFCjV/dpuQyt8fJQKFykHK0DoWbIoFZrWI0YULrJ3VUu7IVDCEwmurN7gM2ICTc3uZeHQvjEbyoydYUFIBzQ6Lp6BrnsrFG5yX19lOzzfgiA0Wgew8KcZfmSM7rBaDK3CC9cLhULPTxiyjJ1hQUB0OtNDU3dXIbWuClkwQGeXE0PTCa6tlHwgekuLhI+Z3vQmNQLrzlFochQ7/+M2fvUFRYAwGymb9V2cFlZIxJRMRF+XEs6gABwq7ZD6MsBgjA2yp+P3/ZWXYeea8OFLdGRfkJDxKYmU1pYBICbVa2c+2FsiY/hjuCDAFTVtPcNDLGb2RIfHSCTcqwFIQjrG7u7hY/jsRH+bq6yMfnvphZTWlgIwqrajk7hzRMfHaByc2FvHoRgc2vvGIba6HBfD3eOwiGEbZ39NfWdLDaMBAd5Bvi5c87hpj5TWlgQwrYOdUV1G5ehNaHBXiFBnuyOdQhh34Cu6Ab3Ri4rggI8IkJ9uAoHGq2+sExw4d6eiviYgOmvq6kuLKAdMl67XstlaI2nu2tSfBBn65jMdG5+tVAXudJNPjMplLNwGpPL+TUGgQHsYhE1KzV8TIvvU4spLSwAACHk0rVbGq2By3AUCMG56ZFirpAbBGF+Ub1VMmM+zJkZyXkEHIKw+EZjUwt3gLwVGSnhSlfZdO+0prqwEIKl5c2VwkfDWakRnu4KzmlWY3NPfnE9iw0jaUmh/j4q9tEQIdjSrr6cL/h4j/iYgPBQb0yE9aNTjakuLAhht1pz4vwNLkNrosJ9E2IDOeMXhvTGI6dLhY6GYcFeqTNCOKfYRhN99Eyp0SRsNPTxcpszM3K6x2VNdWEBAAgmx86UCV3bcVPIFmfFccaPIwjPX64UmlpSKhUvyornjJ9BCF7Jr6msbmc3swJCuGhevFTgoQ9TjWkgLIRQSXnTpbxqLkNrlmQncPoFEIKNLT1Hz5Sy2DCyMDPW15tj4QhB2NbZd/hUCYsNI3PSI8JDvDm726nMNBAWhECrNXy5/5rQLcKJcYHJCSGczUPT+KtDBb1qYT1ibJT/rNRwzjBlTMg3R693dPWzm1kRHOi5MDN2WrtJp4GwAAAIwdOXygtKG7gMR6FUyNcsS+EM+kMUKiprFDqNk0nF61akSbkyWVIIlVW0HDktrEdEEK7NSVVM53fD6SEsCGFX9+CnX1w0c52lZsXKJUnBAR4czkwAdHrjJ19c7Be4vLM0OyEqnMNTCgAwGs2f7rnU3SssRGduemTqjJDplaNwJNNDWAAAhOChkyV5RXVchqOIifTLWZTEOaYgCl0uqDl2pozdzIqQIM+1OalcVoCiUEFx/cETRVyGo/BQud69JmMMu9+mCNOm3hDCzu6Bf+w6J8iXTSG05a7Znu6unOFZOp3x/X+eE9qv3LN2lr+vilO4BpP5w8/Ot3cKm2mtzUmNCvfj7BGnJtNGWODbTqv4+Flh/cqcmZFL5idwNg9FoSvXa7/Yd5XdzIrkxJC1y1O4C0eosKxh195cdjMrwkO8t2yYzeUwmaJMJ2FBCAcGdW+/f0JQ1K9MKn74vvnuKg6/A7AkYv30TMUtAV5+EYW2b5nPp9OiafLhZ+eLBa5537dxbnTEtOy0ppOwgKVfKaj58PPzXO04igWZcetyUjmbByFYXdf59vsnBI226alhm9fN4qwPQrC+uftP/zg+JCQzQFS470P3ZlHTcE3agcIihFi217H8M9OYs72toDH++6dnL1yt5DK8jVQienz70uBAjtdDAACE4MsDeV8fLmA3GwmF0KMPLoqJ5O5XEET7jxbuFjjaPrg5KyMtQtCiE8bYzHXnaRpz9rLjQViWNv4QQvx8VBtXzXR1Zdsw097ZX1BSX1PfaTZjnrEiCML2zv5X/njgk3f8Avzcucy/JSM1/NEHF7/8x/2cAXraIcP//eVwSmJIYmwgi+VI4qIDfvLIsl+8tMdkpll+A4RApzf94b0jaUmh/BME+/uqnvzhih/+fKdGy302KcZELKYSYgLSU8J9vNzsmUEI+waG9h253qvmzmg8NhwlLJrGCzNj//jS/Vy5IXBzW9/B40V/33WmqqaDp7YoCl3Mu/XGu0def+5ezvCVYX7wwMLca7eOnS1jd5kiBCtutb78x/1/feMhdyXfM6623Z158dqtL/dfg6yZlRCCtQ1dL/7hmw/++DBLw1uxdnnqjq3Zf/n4NLsZISQ5Ifix7UtWLU3291WxH72sN5haWnsPny4VOWbvtaOGQgKAVCrmfBoQQqFBnv/z8NLP3vvRonlxnKPJbQj5dM+lnbsvctndxstD8fwvNkZH+HFmWUYIHTxe9Nbfj3MehzSMwlX27BPrUxJDOccsikInz9/4v3cO84/lF4upnz22avG8OJbCCSGrlqZ8/tcfPXL/gkA/d84DvSmEJFKx42IoHCUsoSTFB7/z2oOz0yJ4+pohhEM642tvHzhwvIjL9jbpyWGv/upuX28lp4JpjN/beXrXnkvsZiOJi/L/3bObQ4O9OAsnhHz0r/N/+/QsZ+DNMP6+qtefuzc5IZhRWxjjRfPi3n5lW3QE30Om+f7hsUK98MILw/9zo7LlwLEi/r+WBYJJUkLwhpUzuZ6c23h5KPx8lEfPlBmMJs6uDgAAIdRo9QUlDQkxgaFBXoQfsVH+nirXq9drh3RGlr8CITQYzPnF9SGBnjGRfoAAroIJISQi1Cck0PNyQQ37We0QQpOZLiiu9/P5Nu8GV8GEEOLvq4qPDsgrqusZPTEihPh4Kd96ZVtyQrC9v2iLmcZ7D+RV1fKdfrAjEqHN62dHjUiYwHeCIhQIYX1j18DgkIr3NAUAsGR+4qJ5cfuPFfI8dAUhVNvQ9cOf75yZHCrj2bFDgDHhE+2EEOzoGnjyt//6/OsrLnIJz8IBARKulWkAAIJQ3T/0y1e+3HswX+km41k4hBBRyEqyGJOVS5LmZQjLONTXr21o7pkIUTHDfQvGBkKotLz53OXKDStnctneRi4Tr1qafPhUCeHda1oigJtae7kMR0EhyKdTRAh29w4ePFHMZTgK/oWr+7VCQ8EQglbzJ5lUvGZZitBVxePnblTXdTouiaujhAUh0GgNr719MDjQk/+rNQAgOSFYpZSr+zhS7o4EQYj49XBjAELooPcmMBGFY0K8PBWJccLyOV68WvWHd4/oDaYJGQcZcZSwAAAIweIbTY888eGjDy5avnBGoJ87n+OvA3xVKjd5r1rLW1f/1RBCvDwUXjwOrCeEDGj0LW3qo6dL3v/n+fomjuxo48SBwgIAIAQrq9ufefnLAN/jIUGec2ZG3rt+dgZrsjW5XKJ0kxNAwH/KoYmOhQB3lQu7Mw9jcqWgZu/BvILihqbWno6uAYyJQ1UFHC0sAABCkBDS3K5uau3Nzav+98H8V391z5a75tizhxAKHfgJsUzJvtUi5DXDuQ0hwPKfpQQIgbDvW1UAAqEFjLMCFLKezo+EEPLx7gsvvbm/vasfAoAQhBA6WlVgEoRlAUEIKAgAaGrtfflP+9NTwlg9Lrxm7hhjQoBUKlK5uSgUMle5hKbxoEY/oNENagwYY8Q6iSaEWB5chatMqZC5KWQiETWkMw5q9QMDOr3BBCCgWCWOMSGESCUildJF4Sp1dZGOrwJykQjp9MZBjb6fXwW+g+12Fd9oeu3tgx3d/Zx7iiaWSRLWMBSF6hq7cvOr7QqLh6hojCViUWJs4JLs+LkZUdHhfl6eCqlYhAnRDulb2vtKbjadvVRxrbC2s3vQtgOwtKiXp2JueuSS7ISUxJAgf3eFQkZBZDSZe9Sa2oauywU1Zy9VVNxqNZjMtq2LMRGLqPhov8XZ8VmzoqMj/Lw8FRIxRQjQDOlb2/tKy5vPX67Mza/u7B5ANl0oIQQT4uWhmJseuWhefOqMkOAADzeFDCFkNJl71dqa+s6r12vO5laWV7XqjSZ2ebHfsHOXK1vb+/gJdCKZbGEBAGgat7b32bsKIUAI2btbhBAIYXpy2CP3L1izLDXQ393GRBkZ5rtgbuz3ty0sLW/e9WXu3oP5vX2a4TuLMVYpXTasnLl9S3Z6Sphtls2gAI+UxJCNq9PbO/uPnS374J/nrpc2WP4uAJZD3mFKYsgPHli4ZlmKbYovP6CM+q4CJTebdn2Z++9D+T3qURVQusnvWpW+fWt2ejJTBfw9khOCN65O7+gaOH627IPPzxcU12FM7HV+FGJbv2ltV1vqbNfCMdwBYUEIPT3s5jUViylXF+bETBgTV1fpI/ct+N9HlwcHeDLaDCOTimenRcxMDlu7POWVtw7kF9UjBDEmKYkhzz6xfvXSFM4DtPx9Vdu3ZOcsTHznw1Mffn7eklFMLpNs35L90x+u4DzXTyoRzU6LSE8OW5eT+sqfDuQV1yEIMSZJ8cHPPrF+zfJUCVcF/HyU37s3K2fRjPd2nv7HrrP9AzrbuREhwNVFKrafXsXTQyFoxjZRTLawCCFuCnlCNEtECnO2ZYyJt6fiNz/b8PB9Czg1MYyIQiuXJMdE+j3z8peHThYvX5j4+99ujReSvTzQ3+PlZzbFRfv/5vWvjCb6t09tePTBRXx86xYoCq1YnBQd4ferV788cLxo2YLEN367hX9ADgDA31f1/FN3xUX5/+b/vmrr6LfVFoRs/dGMuCC5TCwodHFC4HuDJgqMSUJMQFK8MIceIUTpJn/5l3fv2Dqfy5aByDDft195YOG8uPUr0saQslUkorZvyfZ0dzUYzHevzeDcqGhLZJjPn17etjAzbl1OapjwClAUeuCeeVKp+MnffN6t1nBGLowkPSUsIsznZmWL0HftcTLZwoIIrlyS5OHOluLbdn5FUegnjyz73r1ZtsZmM93Y0lvb0NXZ3S+VikMCPaPCfW0dhoH+7v/v+8ttvw4A6O3T1tR3Nrf2DumM3l5ukWE+4cHeVp0ihNDe2pSlAjUNnV3dg1KpKDjAMzqCqQJ+7j9+ZBljCX39QzX1nY0tPUM6o4+XW2SYT2iwl22nuHndrObW3hd+v89o4kyad5tAP/dlCxJvVLRwGU4wkyosTEign/u6nDQWG4qCErFopLZoGi/JnvHjR5ZZvdoQQnLzqj/effHStVsd3QMmkxlB6OIijYnw27gmfdumTH9fFWClu3dw975rew/kVdW0a3UGy7uet5db1qzoHffNX5AZy/E6RsiVgpqPd1+8cLWqo6vfZKIRhHK5JDbS/65VM7fdnckZ4Nrdq/li39V/H8qvrG7XDOktFfDxcsucFb1ja/bCzDir3vEHDyy8UlCz78j1EZ8TiUTEXs+Nq9I/23tZ3S9glWz8TKqwCCbLFyYmsM4wKArJZbfjFCyD4I8fXuo5upPT6Y3v7Tz95w9Otnf2o+88fhiQ/oGha4W1BSX1R0+VvvzLu+emR9r+CQslN5t+/dres7mVZjM97HAyGM1NLb3/ar568sLNHz+89KePrnCxk4lepzf97ZPTb79/or2zH46owMCgzlKBI6dLX/nl3ZkZUYxfBwAU32h67vV/n7lUYVWBxpbe+uarJ8/feHz7kp8+umLkOpjCVfaTR5ZdvHZrOKSY8MgdlJ4ctiAzdt+R6zxjRiaEyRt3CSEeKpf7Ns5l99QhCEUiang8xJgsyIxdlBU/0sZkpt/827GX39zf2TUgokZlNYQQWu7y+SuVj/1iZ4GdQ9VuVLY89vSnJ8/fJIRQowNREIIiCvX0al5/59Dr7xxinPaaafzWP469+OY3HV0DlJ0KXLxa9fgzn9rbun2jsuXxpz85ce6GvQqo+7T/95fDr759wKoCc9Ojli9IHI4lhABwvsrIZOL7N8115czWMaFMnrAwJgvnxbM8wRZEImpkHmixmFqXk2rVbRw6UfzOByeMJjPL0gRFofJbbc//fl+PTV6TAY3+xT98c72knuVBRwiaTPS7H5366lC+7dUjp0osu8Q4KlDV+vwbX9vurh4Y1L345jfXSxtYKgAhpGn8/q5zew/kjfxcLKY2rJw5nM8HQqhUyJkKGMXirPg5MyN5RudOCJMkLEKAwlX64OZ5tv5AWzzdFcPeSB8vt7npo7So7te+9/FpPkm5KQqdv1z5zZHrVp8fPV1y4lwZ51sShFA7ZHhv5xmr/bH9A0Pv7Tzd1z/E+XZGUejC1SrbzWRHTpceP8u3An/95ExH16gKzEwOC/Rzt3RaEEIvT+7QBpXS5YF7MvmEN04UkyQsjHHW7JjFo0c0e4QEeX47ZcEkJNAzaHR6mfyi+uul9ZytYsFgMu87Wjhyj6jBaP7qUMGQ3sSlCgAAQBQqK2+2Okc0r6g+v6iOZwWMJvqbo4XaIcOIT8z7jlzX6XhVgKJQWUVzbt6tkR/6+Sgjwnws694UhYJtvP+MrFqanJ7MvddjouB1d8YJAUAukzxwzzw+8VgAgISYQMuEgAAQFOBhNQ4WlNRrh4x8WgUAgCAsv9Xa0q4e/qSze6Csopmzs7EAAdDpjfmj50nXS+s1Wj2/AgBCsPxW68iETZ1dAzcqW/jHF+j1pmuFoyogk4pDAjwJAYQQd6VLbJS/ve+OxNvT7b5NmZwTsoliMoSFaTw3I3Ll4iQuw29JmxEyKy3CbKYxJio3uVXQbWNzD/+5AoSwf0A3cixT92n7B3U8ZQEAIAQ0tPQMT5YJAU0tvVzbcG4DAdBoDSOTa6j7h3rUGiEVIE2tPSM3oiEEVSoXTLDZjOfPjUmI4evHv2vlzJTEEM7dbxPCZLgbZFLx9i3Z7iq+uyo83F1f/eU9ri7Sq9drvWyWuoRuIiKjcz8TwhUPYAPGZETgIRHeMISMqsC30Vv8oWkCRn/Fy901yN9j/tzY555Yb88hYou/r+rBe+YV32gSWoEx4HBh0TSemx65YhHf7spCekrYp+88Wt/UzejCZl5NZIa4uki9RxSiUspdXaTdvbz7DAgC/dyHPZAQwkA/D55ftSCXSUbOr1Vucg+Vq7pviHcFYICvSjR6mfnh+xfctSo9LMRLJnA+vn5l2se7L5aUNzk6kMaxpQMApFLR9i3ZfN5crHCRSxJjA/18lFafz0wO4383MSYxEX4jg1t8vZWxUf78uz2pWDQzOXTkJ2lJoXI538zNGJOocN+R7x++PqqYSD/+FZCIKdtgbh8vt7hof/73YZjgAM8H7smchKA/x/4BmsYZKeFrWddwhDJnZuSM2CCebzcIodXLUpRutz09LnLJupxUljiTkdAYR0f6zp8TO/LDOTMjkuKDML8KUBRaszxFpbxdAblMvC6HO2bGAsY4Ktx3/txRFRgn96ydlRgbxH+eOjYcKyypRPTQlmxv4d0VC34+yh88uFAmE3NOFGgapyWF3Lt+ttXnd61Kz8yI5DyXgRAgFlE7ti4ICfIc+bmvt/IH2xbKeVZgRuiWDdYB/htWzszMiOJTAZGI2rF1PmfslyCCAz3v35TJ010yZhxYOo3xjLig1UuTuQwFs/Wuud/bnAUhZGlamsaB/u7P/3yjlSwAAH4+yuef2hgV5sN6xgYghNy7fvaOrdm2V7dsmPO9e7M5KxAU4PGbpzaEBFpXwNdb+fxTd0WGcldg87rZj9y/wJ7NmNm4emZUuC/nGRPjwYHCQhCuX5nm56PiMhSMi1zy4tObfvi9RTKZxPYAMYwJTeO4aP+3Xt5mz8exIDP2z68+MCMuiLY5+Y0QQNNYIqF2bM1+7dnNI4fRYeRyyQs/3/ijhxbL7VcgNsr/rZe2rVrC/FzNnxv7zmsPJicE09huBR7akv2755grME4iQn1WLU3m7HHHg8MOBSHEy0Px7BPrmcLSJwC5TLJ4XnxUuK+6f6ivf8hoNFs27YhEVFCAx5YNc3737L0LWKcmkWG+S7LjRWKqq2dQqzWYaWwJbFe4SjNSw3/1v+ue/NFKD5XduDG5XLI4Kz4m0l/dp1V/WwFCCBBRVFCAx9a75v7u2c3sc6PIMJ/F2fEiiurqGdQOGc1mTAiwVCA9xVKBFZ6sgWvjQSRCB44XGY0CQrtYsD0UZFRnvmf/tUd/9jHn2M8HmsYL58X9+8Of8PS2j5n+AV1ZRfONypaunkGpRBQe6pOSEBwV7sszzhNjUtfYVXyjsbah22A0eXkqEmMDk+OD2UMRR9I/qCsrb75Z1drVMygSUeEhXqkzQqMFVqDkZlNNfafBaPb2dEuICUiKD2bZFjAhdPcOrv/e24VlDRPid5BKRbv//vhIp5ID/VjpKWGOVhUAQKWUZ8+JyZ4Tw2XIDEIwKtx35KMmFJXbHa7A2PDyUKQmhlwXmEWGPxOgVkZEIipJ4EkVTiYTCOGM+CDHncfsEGERAuQyse2eOydTitAgLxE/f94YcIiwACAymdjd/szXyVTAQ+Uik4on4lWNAQcJC4goxP88Yyd3BIlEJKKQ4DV5fjhKWDRNhOZCdjLJmEw0jbGDdt87SFhQpzf29QtL/+dkklH3a/UGXoGsY8AhwoIQ6PTGxuYeLkMnd5K6xi6jSVhiUf44RFgAALMZF5Y1clk5uWPQNC4sa3TccqGjhAUguFJQ0zUiJNfJlKKlTX29pIFn7P8YcJSwKIQqq9suXq3iMnRyZzh18aZDz7d1lLAAAEM64669uRrt7Z1PTqYIvWrNZ/++YnTk2UYOFBZC6Gxu5TdHrfeLOrnjfLE/71phLc9l8rHhwKIhBDqd4Y9/O1ZV28Fl62TyKC1vfvejUyaHvQ9acKCwAAAIoZtVra//+aBzQJwi9A0MvfrWgZr6icnNxIJjhQUAgBD++2D+2+8LyP3nxEEYjOY/vHf00MliRwe8g0kRFjCZ6bf+cfztfxzX80796GTCGdIZ3/jL4fc+PsVzg9M4mYx1YsupKa+8daChueepx1dN7J4TJ3yoqe98490jX+y7ajSZOU/pmRAmQ1gAAAihwWD+4LNzV6/X7Ng6f21Oakig5+T8wv9mCCENzT0Hjxd9tPtixa1WAOCk3fNJEhawnBoNYMnNpqdf3vP3XWcXzI2dPzc2ISbAz0elcpOLxRRC0EEr7f81EIyJ0WQeGNS1dw7cqGzJzas+f6WytqGLprGjZ+tWTJ6wLCCEMCaV1e3lt9o+2XPJXeni56P08XLz8lSo3Fwm+cf/h0Fj3N8/1KPWdPVqOrr6+/t1BpPZckDr5N/YyRaWBYQgApCmcXfvYGfPgIOCGP9rgRBYEvhMwhkN9rgzwhoGQkhN1qjvZDK5Y4p28p+NU1hOHIJTWE4cglNYThyCU1hOHIJTWE4cgkPcDRiPPhj4O7eK/W9YY3XU8UggVxJ2lu9agAiOOdbbcliSUCy/XtAd4MT6JtswnPjpjuAQYYUGe/l4KoZ/td5o6ujs7+3TEgL4uIAJIR7urmHBXtB2hQeC3j4ty8YyQoiPtzI4wMPe/l4a4x61pr2z32ymhUaPUBSKjfR3cZEI2jxspukhnbF/QNc/MGQwmjkfDE4sudaDAlReHq4I2v0Jja09Pb2aO6WtiRcWjfG8jKg3X7xPIhYRQgAEer2psbnn1MXyPd9cK/92KZStBELAI/cveOYna2w7HoTg638+9ObfjtlrG4TQ0z9evWPrfObgEAgwTTq6By5erfro8wuFZQ387zshxE0he/vVbRkp4QIiTyAwm7F2yNCr1lbXdVzKu3XmUsWt2o6xLd4RAiAEmRlRD9+3IGtWtI+XG6Igo8opCr238/QLv9/HcG1SmHhhIQiPny0rLG1cvjDR8olSIff1Vs5Ki7h3/ew33j38r6+vmuznCCWEeHsqNqyYqXBlOFurV625cLWKEMK4XI0xiQj1WrUk2V66cgvuKpe4KP+cRTNeenP/7n1X+Z+YCCFUuMjYC2fE0901JNAzdUbIPetmNbb0fHkg7/1d5+qbu4UeeiYSoe/dm/XsE+sDuVJsAgDWLEv52ydnWjv6xjzujwdhP4wPEMLePu1fPjw5MKizuhQZ5vPmC/c9vn0JS0ZGjMnstIikBOazta4U1JRVtCA7S2CEkEXz4sNDeSVdDg3yeuO3W9YuTxG0aZMIGgWZCA3yeuqxVbve/eGCubH8NQ0AwJjcvSbjd89u5qMqAEBspP/8OTFEyK+bQCZeWAAAikJnL1fss8nnBgBwdZH+4serF2TG2htNxCJqbU4qY/Y5jMnBk8XaIQOjKgkBri7SdStS+XcDnu6uP3tslY+3m6AGnhBmp0X89Y3tc2ZG8kygggkJ9Hd/8kcr+WQntCAWU+tWpI0hycCEwLcNhKI3mP6+6+zIrFfDeHko/vcHOe4qF9vmxJiEhngtyU6w/RYAoK6x61xupb1ZEcY4MS7QXqJNezpOSwrNmhVN34nHOjrc96WnN/n7qPjImmCycF7cjDjmfEz29hPMnxMTE+nn6FwBjDhKWBRCRWWNu77MZby6bH7ixtXpti/uhJAlWfHhIcxj2emL5Q3NPfbmvBDCVUuSbXPvAABa2tS/eOkLxkzuUolobU7qOI/yMhjNF65WHTtTdvys9b9zuRX1Td32RtsFmbGb183moSsgl0k2rEhjPIAvv7jumZf3MJ5mEODnnrMoiUfxE8+4big7GJOdey6uzUlNTgi2uiQWU49tX3L6QnlTa++wUAgBClfZupw0RukM6YyHThabzTTjNktCiI+Xm71D1Q+dLH7v49Myqfi1X2+2vbp4XnxkmE9ldfsYXtMsqPu1P33us9qGLlv/BYWQr7fbxtXpT/xwhY+Xm9VVCOGmtemffXW5f2CI5f2Uxjg2yj9rdrTtJULIp3tyP/jsXHpy2AP3zLM1WLMs5ePdF9jLdwSO6rEAAAjBhqaev396xmRm2BuZNiP0oS1ZI9sSY5wUHzTHTt75kptNeUV19tqexmRueuSMeIYpv3bIcPBEMY3x8XM3Wjv6bA2CAz2Wzk/gMx7ZhQCDwaw3mAw2/7RDhtqGrj/+7dhrbx9kPIkuISYwmitJBARw5ZIkxlQMDc09Zy6Vm8z0/mNFBqZNUGlJIenJYYJeUCYEBwoLAAAh+Orw9fOXKxmvbt8635Ka4VtjBFctSbZ3ZP6R06W9aq29x04iptblpDJOVItvNuUX14tFVHVtx6Vro3LgWoAQrstJU7rJxyMtCAGDO9cSzIkggOCrQwXlVa22Bu5Kl6gIXxZZW9zF9jLHnLlUUd/ULRJRV6/XlN9qszVQuMrW5qQ6dDc9I479exDCXrXmvZ2nB7V626shgZ6PbV8ik4oJAIQQP2/lKju3r6Nr4PiZUnuv+hiTiFCfxXam/EdOlaj7NBBCncG0/1gh49byjJTw1BkhjpvkIgh7+zSVNe0MlxD08XRjGacwJhkpYSmJIbaXdHrToRNFJhONIOzsHjh6utTWBgCwbEFicIDHJHdajhUWAAAhdPpi+f5jhYxX716TsTgrHtOYxmRuRlRCTACj2eX86oqadnt+BELIkuyEUJtkTACA9s7+42fLLHcUIZibV11Vy9C6KqV8zbIUoSs8gsCYjMx5PhL27kQkotavSGP0ypZVNF8trB1OzH70TGlvn9bWLCrcd+G8uLGscY4DB95KCxACnc74151n2pjmN0o3+U8eWebh7moZy6RMY5mZxgdPFOvstAohwM1Nvn5FKuNDn5tXXfWdIhGEbR39x86U2ZoBAFYsTgrwUznu7iMEFXZc9iwLRBiTkEDPpfOZO+NjZ0q7e75dDUQIlVW0XLtea2smotC6nDQX3sk7JwSHCwsAQFGosLTBnuth0bz4u1bODA/xXjQvjtGgpq7j/BU291VyfHBGaoTtJZOZPnC8aEh/e0qLMT5yqqR/gOHU3dhI/6zZ0Q4aLzAhnu6KGKZ08zTGXT2D9uZYhJBFWXERoT62l7p7NUfPlA1/EUKg0eoPnihi/AnzZkUnxATyTN45IUyGsAAAGJOPv7h4o5LBkyQWUz/avuSR+xfYy2Rx8sLNlja1/VVnuHppsgdTJvPquo6LV6tGrpQhhIpvNhWUNNgai8XU+hVpcgf4qS3xLetXpCVEMwz0/QO6mvpOxsfm27WEnDTGsfJKQfXNqtaRq1sQwrO5FfVN3bbGvt5uKxcnTabHYZKEhRCsb+x6/5/nGLv91MSQHz20hHEKNajRHzpZbG+wIIT4+6hWLmFOSnjy3M3Wjr6RioQQDAzqDp4oZuwh5s+NHbOfmhBACCEEjP5HKAr5+6oefWDRc0+ulzC5YcurWqvrOxkfG4xxQmxgZgaD/4Wm8cETxUOjV7cs/p0zl8pt7QEAq5Yme3koxuVVEYIDHaRWQAj3HsjftCbDdshDCLrIGRYHAQBFZY2FJQ0s7qvMWdHxTD3BgEZ38GQxTWOrxx1CePrizeZWtW3m1UA/9+ULE0srmoFAVEr5a7/ePKjV29bSRS6NjvCNi/aXiBluNcb4ywN5ff1axvcGCOHqpcnentZuVQBArZ3VLaOZPnSieNumTLnN/UxOCJ6dFn7kdClLBMAEMqnC6u4dfPejU7NSw/lHnhw+VaLuH7L33iSTiNavSGPsCQpLG4tvNNoqEiFY29B17krlg0x+6rXLU3d+cUmon1ouk9y1aiaXFQNnLlV8dajAzjhIvL0UK+2sJZy+UN7UyrC6RSF4raiutKJ5zkzrfs5FLlmXk3by/E3HvaCMZJKGQgsIoZPnbxw4XsRl+C2t7X0nzpXZa2KMSVSE78JMhiymhIBDJ4v7+pn1YTCYDxwrZDysKy0pdGZyqIOm8FYU32h87vWvunoGGStJYzJnZiTjqrNGazh0sthkZhiyLU/vkVMltpcAAIvnx4cGe03Or5u8HgsAACEY0hnf+/j04qx4f1+GBQorLl6rulXXac+9RAhZtiCRccpvNtNZs6LDgrwg0xhKCHFXupjNGNj0mwpX2drlqedymZcKJgqaxifO3Xj+91+X3Gy2N8pLLC8TTOFDNE1vXjdr5RLmyTjGJDzEy3YOAACICPFZnB1fU9/JGCY5sUyqsAAAFIWul9Z//tXlnz22it3SaDIfPF6sN5gYT7awiGPt8lTbSwAAsZjauDqd8RInyxfOCA7waGzptdfk4wFjUljW8Ome3L0H83rVGnvPDMYkMsxncVY841WV0uWhLdmMl9hBCK5bnrp731WdzlEpdIaZ1KHQAk2Tj/51saKaYWFrJFU17ZfybtlrXYxJalJoenIY49XxEBXuO39urKCJCE3j5jZ1fVO35V9dY3ePWmPP8q87z/x152l1H/OE3QIhZOn8hFAHHH04Jz1yRlzQ2N58BTHZPRYAACFYU9/5j11nf//brSyrGSfO3Wjr6LcXr01RaO2yFKUb33BK/ogotGFl2leHCwxGM8+nurdP+/0nP2r8LlaMxjgjJfy91x9SKa2rJxZTd6/N2H+sUMO0eGqBEOCmkK1dnuqIWHUvD8Xqpcl5RXVchuPlDvRYAAAIwZf78xhjDSz0DwwdPlli78GyxOnmLJrBeHX8zJsVHR8dwN9PTdO4qaWntqGztqGrtqGrvqn78MmS4+eY144WZ8Uvzo5nmUFjjJMTgmfPjLBnME5WLkn29XJ4NPYd6LEAABDCzu7BPfuvzc+MZXwuC0oaim822Z22Y5I9JyY60s/2Ek3jvoEhni8+EEKlm8zWw+TrrVy5OKlISPYyhCBC6LuBG+r0xp27L65YnKSy6VNd5JJHH1h0/nLlwKCOcfaNEFy9NMWDKfGxwWge1Oh4SoJCUKVysXU7J8YGZmZEfXO00KEOrTsjLACASISiI/wYVUUIOXiiaGBQZ9d9JRNvWJEmZorTvXC16pmX9xh4Z4n5xf+sZgy8XL0s5YPPzvf2jXHDJ0Locn718TNl926YbXt1YWbsikVJe/Zfs21aQoifj3LFYubO+J97c//8wUleNSJALpf86aX7bTcByKTitTlpR06V8tzHMTbujLAwIcEBHvaWYppae09dKLfXojTGM6KCsmbH2F4ihHx9uKCwtJHns2im8d6D+XevzbB9q09OCJ6VGn70zBj91BbHyvv/PLdsYaJt6KJUKt5x3/wT52/YemJpTObNio6PYXBfDWr0X+7Pu1nVKuJXJRqTA8eLGHeXLJoXFxHmU1Uz9mhsTu7MHItgMn9ObEwEw1gGADh/paqusYvlN69YOIPRDdbY0nvmUgVFIZ6IRVR+UV1pOcMajotcsjYnlXHzAk8oCl0rrD18spjxavbs6JyFM2yHbJlEtC4njXFzx/XShqIbjWIR16/6DgrB42fLGKOVQoM8xxuNzcWdEZZcJlm/knnPicFgOnC8yF7GM0KIp7vrGjvuqzOXytkVaQWEsLtXc8RO4OXS+QmhQePyU+sNpk++uNSrZgi+s3RaHu6uI1sXYxIZ7ruAaS0BAHD4VIm9tQRGEEK37Edjr12e6qaQOU5ad0BYNMZx0f7ZTGMZAODmrdYr+TUs7itLGLHtJb3BdPBEsdCkVoSQ42fLGPdOhYd6L8qKG89jTVEor6ju8Cm+nRYhZPnCxJBA69VxAEBLu/rkuRu8RfUtOoPp4IliM9NmllmpDo7G5jKYeCAAKxYn+fkobS8RQr7Yd62zZ8DecykSUWtzUhnXsC/n1+TmVfPvriwghMqrWi/nV9teohDasCLN1VU6DmkBvcH04ecXGIVr1WkRYomQZu6ML1ypqq7vQAKDpykEz+ZW5BfX215yV7msXpoi9HbxR1hFxw8hxNNDsWZZCuPVfUeu79qba++3YkyCAz2WLUi0vVTf1P27Px9U99ndxmMPCIFWZzx4gjnka0565IzYcfmpKQoVFNfbywY6f07M2uWplk4LY5w6IzQjhWEtwWg0HzxRpDfwfdUdBkLY0TXw6lsHGLekr1ic5O+rGk+XzMJkCwtjMndm5EybpRiNVv/BZ+d//uIXLHu8CCFLshKspvyEkGuFtY89/cnFq1Vje/4QhOcvV9Y1MgReenko1uakDhcLAWCMRqQoxLKsazSZP92Ty9hpSSSiRx9c6OuttIQEbliZxriWUFXbfulaNTW2X4fgqQvlP/7lrsLSBisFzYgLXJAZN55JJAuT7W5ACEaE+pRVNA//HpOJrqhu23+s8PzlSp3exCIOiUQUGux5vaTB4oAhhHR0DZy6cPPA8aLW9r6xqQoAgBBsblN//tXldTlpVq4dCiFvT4XCVWZJ5Gk206XlzTTGIxsDQtjdM8i4WfTbQihUfKPxw8/Pr1g0w/aQCLMZx0X7d1wZ8HR3cVe6FJTUW7U0QvDfB/M7u+1ODziBEBw7W3azqnXDyrQl8xN8vZSWp4BCKCzYSyRCjuiz4MiecM/+a4/+7GNHZ6x0dZGKRBT4bpOg2YyHdEbL+Xrstw5C6OoiHXYsEQJ0eqPeYIJw7Ec/DiOViGQyhoB3jIl2yGBpbAihq4vE1m070sYeEolIzlQ+ANCyhRohqHCVMf4Onc7EuItaEBgTAohcKpHJxMN/xWzGQzrD+IUllYp2//3xFYtuOyYnu8cCAGi0BjBq6ymEkGNvnQVCyKBGP/K7EEL+hxaxYzCa7eTpvN1TEEIGNVaVtzGyg9FotterWb6LMWHcPgR4FM4HhCAA0GgyG4wjqzEhZTNwB4QFIRhzoNl4vssJn3s8ngpwls9pMCFMzl+ZmMfdiRMrnMJy4hCcwnLiEJzCcuIQnMJy4hCcwnLiEJzCcjIxWB1oOEpYKqULH0elEycjIQRIRCKr6P5RMooI8fb0UDhoVdLJfyqEED9fZaC/+8gPRwkrNNgrPSVM0F5NJ04IIfNmRQeMTsQySlgyqXjbpkw3V6mDYnSc/OdBCPHyVGzblGk1ibKeUa1akrz1rrlOXTnhAyEAQrhj6/ysOdaB5tbCksnEzz65fs3yFEyIs99ywgIhBEKw7e7Mpx5fZXtwC2RUT1tH3+vvHN6972rfwJAl6+6krIg7mQaQbw/FJF6eih1b5z/1+CrGnA/MwgIAGI3mc5crP//6Sl5hXVfPAGPaEif/hUhEIj9f5bxZ0ds2ZWbNiWE8ZAqwCMuCyUy3tve1dfQNavTjzwHpZLoDAVS5yQP93QP83NldnhzCcuJkbDj97E4cglNYThyCU1hOHML/B95gjC1sQNnpAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTAyLTI4VDIyOjEyOjEzKzAwOjAwqaoUrgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wMi0yOFQyMjoxMjoxMyswMDowMNj3rBIAAAAASUVORK5CYII="
   
            //Valores dos Inputs//
            var certificados = $("#certificados").val();
            var navio = $("#navio").val();
            var agencia = $("#agencia").val();
            var responsavel = $("#responsavel").val();
            var berco = $("#berco").val();
            var total = $("#total").val();

            var atracacao1 = $("#atracacao1").val();
            var inicio1 = $("#inicio1").val();
            var termino1 = $("#termino1").val();
            var desatracao1 = $("#desatracao1").val();

            var atracacao2 = $("#atracacao2").val();
            var inicio2 = $("#inicio2").val();
            var termino2 = $("#termino2").val();
            var desatracao2 = $("#desatracao2").val();

            var observacao ="Observação: "+ $("#observacao").val();
            var metodo ="Método de Qualificação: "+ $("#metodo").val();
           
            
            //Instancia o PDF
            var doc = new jsPDF('l');
            
            //Centro da Tela em Y//
           // var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            var textOffset = (doc.internal.pageSize.width) / 2;

            //Logo Yara//
            doc.addImage(imgData, 'PNG', 2, 2, 10, 10);

            //Textos do Logo//
            doc.setFontSize(9);
            doc.setTextColor(150);
            doc.text(14, 5, 'YARA BRASIL FERTILIZANTES S/A');
            doc.setFontSize(4);
            doc.text(14, 8, 'CNPJ 92.660.604/0013-16');
            doc.text(14, 10, 'Av. Almirante Maximiano Fonseca, 2001 -Distrito Federal');
            doc.text(14, 12, 'CEP 96204-040 Rio Grande/RS');
           
            //Quadrado de Fundo//
            doc.setDrawColor(0,0,255);
            doc.setFillColor(0, 0, 255);
            doc.rect(0, 15, 800, 30,'FD');

            //Titulo//
            doc.setFontSize(11);
            doc.setTextColor(255,255, 255);
            doc.text(textOffset,20,"CERTICADO DE DESCARGA - Nº "+certificados);

            //Retangulos Brancos do certificado de descarga//
            doc.setDrawColor(0,0,0);
            for(var i = 22; i<41;i+=4)
            {
                doc.setFillColor(255, 255, 255);
                doc.rect(30,i, 69, 4,'FD');

            }

            for(var i = 22; i<35;i+=4)
            {
                doc.setFillColor(255, 255, 255);
                doc.rect(128,i, 69, 4,'FD');

            }

            for(var i = 22; i<35;i+=4)
            {
                doc.setFillColor(255, 255, 255);
                doc.rect(226,i, 69, 4,'FD');

            }
           
            //Colunas 1 //
            doc.setFontSize(6);
            doc.setTextColor(255,255, 255);
            doc.text(2, 25, 'Navio');
            doc.text(2, 29, 'Agência');
            doc.text(2, 33, 'Terminal/Arm. Responsável');
            doc.text(2, 37, 'Berço Atracação');
            doc.text(2, 41, 'Total Descarregado (Ton)');

            doc.setTextColor(255,255, 255);
            doc.text(100, 25, 'Data de Atracação');
            doc.text(100, 29, 'Data de Inicio');
            doc.text(100, 33, 'Data de Término');
            doc.text(100, 37, 'Data de Desatracação');


            doc.setTextColor(255,255, 255);
            doc.text(198, 25, 'Data de Atracação');
            doc.text(198, 29, 'Data de Inicio');
            doc.text(198, 33, 'Data de Término');
            doc.text(198, 37, 'Data de Desatracação');

            //Valores 1 //
            doc.setTextColor(0,0, 0);
            doc.text(31,25,navio);
            doc.text(31,29,agencia);
            doc.text(31,33,responsavel);
            doc.text(31,37,berco);
            doc.text(31,41,total);

            //Valores 2//
            doc.text(129,25,atracacao1);
            doc.text(129,29,inicio1);
            doc.text(129,33,termino1);
            doc.text(129,37,desatracao1);

            //Valores 2//
            doc.text(227,25,atracacao2);
            doc.text(227,29,inicio2);
            doc.text(227,33,termino2);
            doc.text(227,37,desatracao2);

            //Tabela//
            doc.autoTable({
                html: '#datatable',
                startY: 47,
                columnStyles: {halign: 'center'},
            });


            //Posição final da table//
            var table =doc.previousAutoTable.finalY+3;
            
            //Observações//
            var obs =doc.splitTextToSize(observacao, textOffset);
            doc.text(2,table,obs);

            //Pega tamanho do campo de observações//
            var textHeight =doc.getTextDimensions(obs) ;
           
            //Metodo De Quantificação Oficial//
            doc.text(2,table+textHeight.h+5,metodo);

            //Quadrado de Assinatura//
            doc.setDrawColor(0,0,0);
            doc.setFillColor(255, 255, 255);
            doc.rect(210, table, 80, 40,'FD');


            //Salva Documento//
            doc.save('teste.pdf');


        });
    });      
});

function buscar(){
    var navioSelecionado = $('#cmbNavio').val();
    var planoSelecionado = $('#cmbPlano').val();

    var table="<table id='tblNCM' class='table table-striped table-bordered' cellspacing='0' width='100%'>" +
            "<thead>" +
                "<tr>" +
                    "<th class='text-center'>Produto</th>" +
                    "<th class='text-center'>NCM</th>" +
                    "<th class='text-center'>País/Porto Procedência</th>" +
                    "<th class='text-center'>BL</th>" +
                "</tr>" +
            "</thead>" +
            "<tbody>";

    var data = {
        navio: navioSelecionado,
        plano: planoSelecionado
    }

    var request = $.ajax({
        url: urlCabecalho,
        data: JSON.stringify(data),
        method: "GET",
        crossDomain: true
    });

    var request2 = $.ajax({
        url: urlTabela,
        data: JSON.stringify(data),
        method: "GET",
        crossDomain: true
    });

    request.done(function (data) {
        var certificado = $('#certificados').text(data.resposta);
        var navio = $('#navio').text(data.resposta);
        var agencia = $('#agencia').text(data.resposta);
        var responsavel = $('#responsavel').text(data.resposta);
        var berco = $('#berco').text(data.resposta);
        var total = $('#total').text(data.resposta);
        var atracacao1 = $('#atracacao1').text(data.resposta);
        var inicio1 = $('#inicio1').text(data.resposta);
        var termino1 = $('#termino1').text(data.resposta);
        var desatracao1 = $('#desatracao1').text(data.resposta);
        var atracacao2 = $('#atracacao2').text(data.resposta);
        var inicio2 = $('#inicio2').text(data.resposta);
        var termino2 = $('#termino2').text(data.resposta);
        var desatracao2 = $('#desatracao2').text(data.resposta);
        var observacao = $('#observacao').text(data.resposta);
        var metodo = $('#metodo').text(data.resposta);
    })
    
    request2.done(function (data) {
            //Body//
        for (var i = 0; i < data.length; i++) {
            table += '<tr  value="'+ data[i].resposta +'">' +             
            '<td >'+ data[i].resposta +'</td>' +  
            '<td >'+ data[i].resposta +'</td>' +
            '<td >'+ data[i].resposta +'</td>' +
            '<td >'+ data[i].resposta +'</td>' +
            '</tr>';
        }

        //Close Table//
        table+='</tbody></table>';
    })
    console.log(data);
}

function incluir(){
    var assinatura = $('#cmbAssinatura').val();
    var textObs= $('#txtObs').text();

    var data = {
        ass:assinatura,
        obs:textObs
    }
    $.ajax({
        type: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data:JSON.stringify(data),
        url: urlIncluirobs,
        dataType: "json",
        crossDomain: true,
        success: function (sucesso){                            
            swal("Cadastro salvo com sucesso!", "", "success");  
            $.unblockUI();                                                           
           },
        error: function(data){                                              
            swal("Cadastro não realizado! " + data.responseText, "", "error");         
            $.unblockUI();                     
        }
    });
}