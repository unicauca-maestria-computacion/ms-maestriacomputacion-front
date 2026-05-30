import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';

import { OtrasolicitudComponent } from './otrasolicitud.component';
import { RadicarService } from 'src/app/modules/gestion-solicitudes/services/radicar.service';

describe('OtrasolicitudComponent', () => {
    let component: OtrasolicitudComponent;
    let fixture: ComponentFixture<OtrasolicitudComponent>;
    let radicarSpy: jasmine.SpyObj<RadicarService>;

    beforeEach(async () => {
        radicarSpy = jasmine.createSpyObj<RadicarService>('RadicarService', [], {
            formInfoOtraSolicitud: new FormBuilder().group({
                asuntoSolicitud: [''],
                contenidoSolicitud: [''],
                requiereAvalTutor: [false],
                requiereAvalDirector: [false],
            }),
        });

        await TestBed.configureTestingModule({
            declarations: [OtrasolicitudComponent],
            imports: [ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: RadicarService, useValue: radicarSpy },
                FormBuilder,
                ChangeDetectorRef,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OtrasolicitudComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
