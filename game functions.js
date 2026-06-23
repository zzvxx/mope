function msg_65517(buffer) {
    $.minimap.synchronize(buffer)
}

function msg_65518(buffer) {
    let ent = qa.get(buffer.id)
    let text = buffer.translate && Zf(buffer.chat) ? Z(buffer.chat) : buffer.chat
    if (ent) {
        ent.chat(text)
    }
}

function msg_65519(buffer) {
    let is_me = false
    for (let i = 0; i < 10; i++) {
        let ent_id = buffer.readUint16()
        let ent_xp = buffer.readUint32()
        let ent_obj = qa.get(ent_id)
        if (ent_id === $.playerID) {
            is_me = true
        }
        if (i < 9 || ($.player && $.animalStats.xp > ent_xp)) {
            Gu(i, ent_obj?.originalName, ent_xp, ent_id === $.playerID)
        }
    }
    if (!is_me && $.player) {
        Gu(9, $.player.originalName, $.animalStats.xp, true)
    }
}

function msg_65521(buffer) {
    let ent = qa.get(buffer.id)
    if (ent) {
        ent.isStatic = false
    }
}

function msg_65522(buffer) {
    let ent = qa.get(buffer.id)
    if (ent) {
        ent.isStatic = true
    }
}

function msg_65523(buffer) {
    let ent = qa.get(buffer.id)
    if (ent) {
        ent.destroy()
    }
    if (buffer.hasKiller && buffer.killer) {
        let killer_obj = qa.get(buffer.killer)
        if (killer_obj && ent) {
            ent.target.position.set(killer_obj.target.position)
        }
    }
}

function msg_65524(buffer) {
    let type_str = Yf[buffer.readUint8()]
    switch (type_str) {
        case 'animal': {
            let sub_type = Y[buffer.readUint8(false)]
            qa.create(type_str, sub_type, buffer)
            break
        }
        case 'food': {
            let sub_type = Dn[buffer.readUint8(false)]
            qa.create(type_str, sub_type, buffer)
            break
        }
        case 'ability': {
            let sub_type = xn[buffer.readUint8(false)]
            qa.create(type_str, sub_type, buffer)
            break
        }
        default: {
            qa.create(type_str, buffer)
            break
        }
    }
}

function msg_65525(buffer) {
    let ent_id = buffer.readBits(14)
    let ent = qa.get(ent_id)
    if (ent) {
        ent.synchronize(buffer)
        ent.lastUpdate = bn.lastUpdate
    } else {
        mt(`Client`, `Recieved position update for an unknown entity`, ent_id, `exiting early...`, `Main player ID is`, $.player?.id)
        buffer.offset = buffer.byteLength
    }
}

function msg_65526(buffer) {
    let me = $.player
    if (me && me.species === Y.black_dragon) {
        me.updateApexWheel(buffer.apexes)
    }
}

function msg_65527(buffer) {
    $.camera.update(buffer)
}

function msg_65528(buffer) {
    Yn.serverMessage = buffer.message
}

function msg_65529(buffer) {
    if ($.player && $.player.arena) {
        $.player.arena.setTimers(buffer.inner, buffer.outer)
    }
}

function msg_65530(buffer) {
    let ent = qa.get(buffer.id)
    if (ent) {
        ao({ visible: true, name: ent.name.text })
    }
}

function msg_65531(buffer) {
    let now_time = performance.now()
    let skill_slot = Qf[buffer.slot]
    ui.cooldowns[skill_slot].endsAt = buffer.remaining > 0 ? now_time + buffer.remaining : 0
    ui.cooldowns[skill_slot].active = buffer.active ?? false
}

function msg_65532(buffer) {
    ni(buffer.coins)
}

function msg_65533(buffer) {
    $.animalStats.oxygen = buffer.oxygen
    si()
}

function msg_65534(buffer) {
    $.animalStats.resource.value = buffer.resource
    ci($.animalStats.resource.max)
}

function msg_65535(buffer) {
    let now_time = performance.now()
    if (buffer.xp !== 0 && Ba.lstxppop + 500 <= now_time) {
        Ba.list.add(new Ba(buffer.xp - $.animalStats.xp))
    }
    $.animalStats.xp = buffer.xp
    li()
    if ($.player && $.animalStats.xp <= Wu.entries[9].xp && Wu.entries[9].name !== undefined) {
        Gu(9, $.player.originalName, $.animalStats.xp, true)
    }
}
