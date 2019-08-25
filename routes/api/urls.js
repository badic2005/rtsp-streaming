const express = require('express');
const router = express.Router();
const Stream = require('node-rtsp-stream');
const auth = require('../../middleware/auth');

const Url = require('../../models/Url');

let i = 1;
const wsStreams = [];

router.get('/', auth, (req, res) => {

    Url.find({user_id: req.user.id})
        .sort({date: -1})
        .then(urls => res.json(urls));
});

router.post('/play', auth, (req, res) => {

    const urlId = req.body.urlId;
    Url.findById(urlId)
        .then(data => {
            const wsPort = 9000 + i++;
            const stream = new Stream({
                streamUrl: data.url,
                wsPort: wsPort
            });

            wsStreams.push({
                id: urlId,
                stream: stream
            });

            const streamData = {
                streamUrl: data.url,
                wsPort: wsPort
            };

            res.json(streamData);
        })
});

router.post('/stop', auth, (req, res) => {

    const urlId = req.body.urlId;
    Url.findById(urlId)
        .then(data => {
            wsStreams.forEach((streaming_data) => {
                if (streaming_data.id === urlId) {
                    streaming_data.stream.mpeg1Muxer.stream.kill();
                }
            });
            res.json({urlId: urlId});
        })
});

router.post('/', auth, (req, res) => {
    Url.find({user_id: req.user.id, url: req.body.url})
        .then(url => {
            if (url && url.length !== 0) return res.status(400).json({msg: 'Url already exist'});

            const newUrl = new Url({
                url: req.body.url,
                user_id: req.user.id
            });

            newUrl.save().then(url => res.json(url));
        })
        .catch(err => res.status(404).json({success: false}));
});

router.delete('/:id', auth, (req, res) => {
    Url.findById(req.params.id)
        .then(url => url.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));

});

module.exports = router;
