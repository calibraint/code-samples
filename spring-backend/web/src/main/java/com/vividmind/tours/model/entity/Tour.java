package com.vividmind.tours.model.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@Setter
@Entity
public class Tour {

    @Id
    private int id;
    private String name;
    @Column(length = 5000)
    private String longDesc;
}
